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
    }
    post {
        always {
            deleteDir()
        }
    }
}