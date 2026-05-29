pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-credentials')
        DOCKERHUB_USER  = "${DOCKERHUB_CREDS_USR}"
        IMAGE_TAG       = "${env.BUILD_NUMBER}"
        REPO_URL        = 'https://github.com/YOUR_GITHUB_USER/leet-code-clone.git'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: "${REPO_URL}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Web') {
                    steps {
                        sh """
                            docker build \
                              -f docker/Dockerfile.web \
                              -t ${DOCKERHUB_USER}/leet-clone-web:${IMAGE_TAG} \
                              -t ${DOCKERHUB_USER}/leet-clone-web:latest \
                              .
                        """
                    }
                }
                stage('Build API') {
                    steps {
                        sh """
                            docker build \
                              -f docker/Dockerfile.api \
                              -t ${DOCKERHUB_USER}/leet-clone-api:${IMAGE_TAG} \
                              -t ${DOCKERHUB_USER}/leet-clone-api:latest \
                              .
                        """
                    }
                }
                stage('Build Worker') {
                    steps {
                        sh """
                            docker build \
                              -f docker/Dockerfile.worker \
                              -t ${DOCKERHUB_USER}/leet-clone-worker:${IMAGE_TAG} \
                              -t ${DOCKERHUB_USER}/leet-clone-worker:latest \
                              .
                        """
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh "echo ${DOCKERHUB_CREDS_PSW} | docker login -u ${DOCKERHUB_CREDS_USR} --password-stdin"
                sh "docker push ${DOCKERHUB_USER}/leet-clone-web:${IMAGE_TAG}"
                sh "docker push ${DOCKERHUB_USER}/leet-clone-web:latest"
                sh "docker push ${DOCKERHUB_USER}/leet-clone-api:${IMAGE_TAG}"
                sh "docker push ${DOCKERHUB_USER}/leet-clone-api:latest"
                sh "docker push ${DOCKERHUB_USER}/leet-clone-worker:${IMAGE_TAG}"
                sh "docker push ${DOCKERHUB_USER}/leet-clone-worker:latest"
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    export DOCKERHUB_USER=${DOCKERHUB_USER}
                    export IMAGE_TAG=${IMAGE_TAG}
                    docker-compose -f docker/docker-compose.prod.yml pull
                    docker-compose -f docker/docker-compose.prod.yml up -d --remove-orphans
                """
            }
        }
    }

    post {
        success {
            echo "Build #${IMAGE_TAG} deployed successfully"
        }
        failure {
            echo "Build #${IMAGE_TAG} failed"
        }
        always {
            sh 'docker logout'
        }
    }
}
