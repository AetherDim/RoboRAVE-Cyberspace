import xml.etree.ElementTree as ET
import itertools
import copy
import subprocess
import os
from multiprocessing import Process
import re

replace = "stroke" # "fill"
width = 3200
height = 2160
PROCESS_COUNT = 32

INKSCAPE_VERSION_IS_OLD = True

def isInkscapeVersionOld():
    if not hasattr(isInkscapeVersionOld, "INKSCAPE_VERSION_IS_OLD"):
        txt = subprocess.check_output(["inkscape", "--version"])
        res = re.search(r"Inkscape (\d+)\.(\d+)\.(\d+)", str(txt))
        isInkscapeVersionOld.INKSCAPE_VERSION_IS_OLD = (int(res.group(1)) == 0)
        print("Inkscape version is " + "old" if isInkscapeVersionOld.INKSCAPE_VERSION_IS_OLD else "new")

    return isInkscapeVersionOld.INKSCAPE_VERSION_IS_OLD

def exportPNG(name):
    svgName = name + ".svg"
    if isInkscapeVersionOld():
        subprocess.run(["inkscape", '--export-png', f'{name+".png"}', f'--export-width={width}', f'--export-height={height}', svgName])
    else:
        subprocess.run(["inkscape", '--export-type=png', f'--export-filename={name+".png"}', f'--export-width={width}', f'--export-height={height}', svgName])
	

if __name__ == '__main__':                
    exportPNG("dino")
    exportPNG("cloud")
