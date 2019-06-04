# DNAC Prometheus Exporter

This repository is reference source code for a Prometheus Data Exporter for DNAC. 

## Pre-requisites
1. Node version v8.11.2 or beyond recommended.  (Tested with node v 8.11.2)
2. Docker 18.09.2 or beyond recommended. (Tested with docker 18.0.9.2).  docker-compose should be available.
3. Bash shell for helper scripts

## Configuration & Run
./init.sh <Local Machine IP Address> <DNAC IP Address> <DNAC admin user> <DNAC admin password>
All parameters are mandatory

**Example**
./init.sh 1.2.3.1 1.2.3.4 admin admin_password

## Usage
Browse http://localhost:9000/metrics whether metrics are seen
Browse http://localhost:9090 and check whether metrics with dnac_ are exported.
If the metrics are present, execute queries and examine results and graphs.  

## Troubleshoot
Console logs should indicate if there are issues in starting up docker or node.
For checking prometheus and scraper connectivity check browser http://localhost:9090 -> Status -> Targets.

----

## Licensing info
BSD 3 license

----

## Credits and references

1. https://github.com/stefanprodan/dockprom
2. https://prometheus.io/
3. https://www.cisco.com/c/en/us/products/cloud-systems-management/dna-center/index.html
