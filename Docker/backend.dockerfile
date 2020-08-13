FROM openjdk:8u252-jdk

ENV JETTY_HOME=/opt/oskari/jetty-distribution-9.4.12.v20180830
ENV JETTY_BASE=/opt/oskari/oskari-server

WORKDIR /opt/oskari
#COPY ./jetty-9.4.12-oskari/ /opt/oskari
#RUN chmod +x /opt/oskari/wait-for-pg.sh &&\
#    chmod +x /opt/oskari/start.sh &&\
#    chmod -R +x /opt/oskari/* &&\
#    mkdir logs

CMD ["sh", "-c", "java -jar ${JETTY_HOME}/start.jar jetty.base=${JETTY_BASE}"]
