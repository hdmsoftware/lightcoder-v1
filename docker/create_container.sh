############################################
echo "Create Docker Image based on the dockerfile"
# name the new image "sandbox_docker"
docker build -t 'sandbox_all' - < Dockerfile
############################################