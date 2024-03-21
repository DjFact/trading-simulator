#!/bin/bash


repos=$(aws ecr describe-repositories --region eu-central-1 --query 'repositories[*].repositoryName' --output text | grep trading.production )

# init array updatet_images
updatet_images=()

# init hash map
declare -A map
declare -A service_map

# Filling out the hash map of correspondence between the names of services and containers
service_map["trading_gateway"]="trading.production.gateway"
service_map["trading_billing"]="trading.production.billing"
service_map["trading_auth"]="trading.production.auth"
service_map["trading_loyalty"]="trading.production.loyalty"
service_map["trading_mail"]="trading.production.mail"
service_map["trading_worker_market"]="trading.production.worker_market"


for repo in $repos; do
  echo "repo: $repo"
  tags=$(aws ecr list-images --repository-name "$repo" --region eu-central-1 --query 'imageIds[*].imageTag' --output text)
  tag_array=()
  for tag in $tags; do
    if [[ $tag == *"latest"* ]] || [[ $tag == *"v1.0.0"* ]]; then
      continue
    fi
    # create a sorted array by value from tag
    tag_array+=($tag)

  done
  # sort array by value from tag
  sorted_tag_array=($(printf '%s\n' "${tag_array[@]}" | sort -V))
  echo "sorted_tag_array: ${sorted_tag_array[@]}"
  # get the last element of the array
  last_tag=${sorted_tag_array[-1]}
  echo "last_tag: $last_tag"
  # get repository name
  repo_name=$(echo "$repo" | cut -d'/' -f2)
  echo "repo_name: $repo_name"

  sed -i "s/$repo_name.*/$repo_name:$last_tag/g" /home/ubuntu/docker-compose.yml
  updatet_images+=("$repo_name:$last_tag")

  # Finding the appropriate service for the repository
  service_name=${service_map[$repo_name]}
  if [ ! -z "$service_name" ]; then
    map+=([$service_name]="$repo_name:$last_tag")
  fi
done

docker-compose -f /home/ubuntu/docker-compose.yml pull
docker stack deploy --with-registry-auth -c /home/ubuntu/docker-compose.yml trading

# Update services in Docker Swarm
for service in "${!map[@]}"; do
  echo "service: $service"
  echo "image: ${map[$service]}"
  docker service update -d  --with-registry-auth --image 616475584916.dkr.ecr.eu-central-1.amazonaws.com/"${map[$service]}" "$service"
  sleep 2

done
