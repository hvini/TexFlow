FROM kjarosh/latex:2025.1-medium


RUN apk update && apk add --no-cache \
    python3 \
    py3-pip \
    && pip install --no-cache-dir --break-system-packages flask gunicorn flask-cors

RUN tlmgr update --self && tlmgr install acmart ieeetran collection-fontsrecommended libertine newtx totpages environ hyperxmp iftex ifmtarg ncctools trimspaces cmap comment inconsolata

WORKDIR /app

COPY app.py .

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "1", "--threads", "8", "--timeout", "0", "app:app"]