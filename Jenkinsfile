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
                sh 'ls -al'
            }
        }
        stage('Build') {
            steps {
                sh 'make all'
            }
        }
        stage('Upload - Development') {
            when {
                environment name: 'RCH_ENVIRONMENT', value: 'development'
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'jenkins-aws-development', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    sh 'aws s3 mv ./dist/reach.min.js s3://assets.rch.red/sdk/checkout-web/reach.min.js'
                }
            }
        }
        stage('Upload - Sandbox') {
            when {
                environment name: 'RCH_ENVIRONMENT', value: 'sandbox'
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'jenkins-aws-sandbox', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    sh 'aws s3 mv ./dist/reach.min.js s3://assets.rch.how/sdk/checkout-web/reach.min.js'
                }
            }
        }
        stage('Upload - Production') {
            when {
                environment name: 'RCH_ENVIRONMENT', value: 'production'
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'jenkins-aws-production', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    sh 'aws s3 mv ./dist/reach.min.js s3://assets.rch.io/sdk/checkout-web/reach.min.js'
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