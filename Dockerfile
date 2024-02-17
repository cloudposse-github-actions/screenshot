FROM ghcr.io/puppeteer/puppeteer:21.7.0

USER root

RUN apt-get update && apt-get install -y pdf2svg

# Install Additional Fonts
ARG TWITTER_COLOR_EMOJI_VERSION="14.0.2"
ARG GOOGLE_NOTO_COLOR_EMOJI_VERSION="2.042"

RUN mkdir -p /usr/share/fonts 

# Solution found in https://stackoverflow.com/questions/50662388/running-headless-chrome-puppeteer-with-no-sandbox

# Install Noto Color Emoji
RUN curl --location --silent --show-error -o /usr/share/fonts/NotoColorEmoji.ttf  https://github.com/googlefonts/noto-emoji/blob/v${GOOGLE_NOTO_COLOR_EMOJI_VERSION}/fonts/NotoColorEmoji.ttf?raw=true 

# Install Twitter Emoji Font
RUN wget https://github.com/13rac1/twemoji-color-font/releases/download/v${TWITTER_COLOR_EMOJI_VERSION}/TwitterColorEmoji-SVGinOT-Linux-${TWITTER_COLOR_EMOJI_VERSION}.tar.gz && \
    tar -xzvf TwitterColorEmoji-*.tar.gz --wildcards '*.ttf' && \
    rm -f TwitterColorEmoji-*.tar.gz && \
    find . -type f -wholename 'TwitterColorEmoji-*/*.ttf' -exec mv {} /usr/share/fonts \;

# Rebuild the font cache
RUN fc-cache -f -v && \
    fc-list | grep -i emoji

