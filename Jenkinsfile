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
        stage('Upload') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'jenkins-aws-development', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    sh 'aws s3 mv ./dist/reach.min.js s3://assets.rch.red/sdk/checkout-web/reach.min.js'

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