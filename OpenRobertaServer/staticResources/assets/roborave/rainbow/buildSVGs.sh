#!/usr/bin/env bash

cd es
python3 generateImagesES.py
gzip -k *.png
cd ..

cd ms
python3 generateImagesMS.py
gzip -k *.png
cd ..

cd hs
python3 generateImagesHS.py
gzip -k *.png
cd ..