pipeline {
    agent {
        dockerfile {
        }
    }
    environment {
        HOME = '.'
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
        stage('Upload - Development') {
            when {
                not {
                    environment name: 'RCH_ENVIRONMENT', value: 'none'
                }
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: env.RCH_CREDENTIALS, secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    sh 'aws s3 mv ./dist/reach.min.js s3://${RCH_BUCKET}/sdk/checkout-web/reach.min.js'
                }
            }
        }
        stage('Upload - Unknown') {
            when { 
                environment name: 'RCH_ENVIRONMENT', value: 'none'
            }
            steps {
                echo '********* RCH_ENVIRONMENT NOT DEFINED *********'
            }
        }
    }
    post {
        always {
            deleteDir()
        }
    }
}