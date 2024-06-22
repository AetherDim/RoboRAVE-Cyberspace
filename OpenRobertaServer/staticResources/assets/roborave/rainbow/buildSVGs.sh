#!/usr/bin/env bash

cd es
python3 generateImagesES.py
cd ..

cd ms
python3 generateImagesMS.py
cd ..

cd hs
python3 generateImagesHS.py
cd ..