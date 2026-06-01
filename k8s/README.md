# Kubernetes Configuration for Cinema Booking Microservices

This directory contains the complete Kubernetes manifest files for deploying the cinema booking microservices architecture.

## Directory Structure

```
k8s/
├── namespace.yaml              # Kubernetes namespace
├── secrets.yaml                # Database & API credentials
├── configmaps.yaml             # All ConfigMaps (common + service-specific)
├── postgres.yaml               # PostgreSQL StatefulSet + Services
├── mongodb.yaml                # MongoDB StatefulSet + Services
├── rabbitmq.yaml               # RabbitMQ StatefulSet + Services
├── booking-deployment.yaml     # Booking microservice
├── identity-deployment.yaml    # Identity microservice
├── catalog-deployment.yaml     # Catalog microservice
├── notifications-deployment.yaml # Notifications microservice
├── ingress.yaml               # Ingress configuration
├── kustomization.yaml            # Kustomize orchestration (MAIN FILE)
└── README.md                      # This file
```

## Architecture Overview

### Stateful Components (StatefulSets)
- **PostgreSQL**: Relational database for booking, identity, and catalog services
- **MongoDB**: NoSQL database for read-models
- **RabbitMQ**: Message broker for asynchronous communication between services

### Microservices (Deployments)
- **Booking**: Port 3001 - Handles ticket booking operations
- **Identity**: Port 3002 - User authentication and authorization
- **Catalog**: Port 3003 - Movie, hall, and session management
- **Notifications**: Port 3004 - Email and notification handling

### Configuration Management
- **Secrets**: Database credentials, API tokens, JWT secrets
- **ConfigMaps**: 
  - Common: Shared configuration (host addresses, database names)
  - Service-specific: Individual service configurations

## Deployment Instructions

### Deploy to Kubernetes

```bash
cd k8s/

# Deploy using Kustomize orchestration
kubectl apply -k .

# Verify deployment
kubectl get pods -n cb
```

## Accessing Services

### via Ingress
If you use minikube, add to your local `/etc/hosts` or configure DNS:
```
<minikube-ip> cinema-booking.com
<minikube-ip> rabbitmq.cinema-booking.com
```

And also enable ingress in configuration
```bash
minikube addons enable ingress
```

Then access via:
- Booking: `http://cinema-booking.com/booking`
- Identity: `http://cinema-booking.com/identity`
- Catalog: `http://cinema-booking.com/catalog`
- Notifications: `http://cinema-booking.local/notifications`
