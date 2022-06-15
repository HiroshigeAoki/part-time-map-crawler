# Pull base image
FROM python:3.9

# Set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN python -m venv venv
RUN source venv/bin/activate
RUN pip install --upgrade pip

WORKDIR /code/

# Install dependencies
COPY requirements.txt /code/
RUN pip install -r requirements.txt 
COPY . /code/

EXPOSE 8000