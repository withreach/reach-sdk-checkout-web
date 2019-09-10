pipeline {
    agent {
        dockerfile {
        }
    }
    stages {
        stage('Setup') {
            steps {
                sh 'npm --version'
                sh 'pwd'
                sh 'env'
            }
        }
        stage('Build') {
            steps {
                sh 'make all'
            }
        }
        stage('Debug') {
            steps {
                sh 'ls -al'
                sh 'ls -al dist' 
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'jenkins-aws-development', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    sh 'aws s3 ls s3://reach-lambda-layers'
                }
            }
        }
    }
    post {
        always {
            deleteDir()
        }
    }
}