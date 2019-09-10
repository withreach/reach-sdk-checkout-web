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
        }
    }
    post {
        always {
            deleteDir()
        }
    }
}