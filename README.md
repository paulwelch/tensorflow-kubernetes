# tensorflow-kubernetes

Utilities and demos of tensorflow machine learning running on Kubernetes.

## nodejs-inception-demo

1. Run inception using tensorflow serving
* Build tensorflow serving docker image following instructions here https://www.tensorflow.org/serving/serving_inception (or use mine @ https://hub.docker.com/r/paulwelch/tensorflow-serving-inception/).
* Deploy on Kubernetes
    ```
    kubectl apply -f nodejs-inception-demo/inception_serving_k8s.yaml
    ```

2. Run demo UI to submit an image to inception service
* Build nodejs-inception-demo docker image (or use mine @ https://hub.docker.com/r/paulwelch/image-classifier-ui/).
    ```
    cd nodejs-inception-demo
    docker build -t myimages/image-classifier-ui .
    cd ..
    ```

* Deploy on Kubernetes.
    ```
    kubectl apply -f nodejs-inception-demo/inception_ui_k8s.yaml
    ```

* Depending on your Kubernetes environment, optionally expose the UI service or create an ingress for it.  Note: the code is written to run on a /inception path prefix to allow use with path based routing in loadbalancers.  Path tested with Traefik.
    ```
    for example:
    kubectl apply -f nodejs-inception-demo/inception_ui_k8s_ingress.yaml
    ```


## Authors

Created and maintained by [Paul Welch](https://github.com/paulwelch)

Testing image ![attribute in markdown](/tensorflow-kubernetes/nodejs-inception-demo/html/images/my_cat.jpg)


# License

MIT Licensed. See LICENSE for full details.
