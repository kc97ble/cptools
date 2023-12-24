FROM public.ecr.aws/lambda/nodejs:20

RUN dnf install -y texlive-scheme-basic

RUN dnf install -y texlive-collection-langother

COPY index.js ${LAMBDA_TASK_ROOT}

CMD [ "index.handler" ]
