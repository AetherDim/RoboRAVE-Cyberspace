import xml.etree.ElementTree as ET
import itertools
import copy
import subprocess
import os
from multiprocessing import Process
import re

red = "#e40303"
orange = "#ff8c00"
yellow = "#ffed00"
green = "#008026"
blue = "#004dff"
purple = "#750787"

colors = [red, yellow, green, blue]

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

def recursiveReplace(child, colormap):
    if len(child) != 0:
        for c in child:
            recursiveReplace(c, colormap)
    
    # end node
    if replace in child.attrib and child.attrib[replace] in colormap:
        print(child.attrib[replace] + " -> " + colormap[child.attrib[replace]])
        child.set(replace, colormap[child.attrib[replace]])

def generatePermutation(name, tree, i, c):
    colormap = dict(zip(colors, c))
        
    svg = copy.copy(tree)
    recursiveReplace(svg.getroot(), colormap)

    svgName = name+str(i)+".svg"

    with open(svgName, "wb") as f:
        svg.write(f)

    if isInkscapeVersionOld():
        subprocess.run(["inkscape", '--export-png', f'{name+str(i)+".png"}', f'--export-width={width}', f'--export-height={height}', svgName])
    else:
        subprocess.run(["inkscape", '--export-type=png', f'--export-filename={name+str(i)+".png"}', f'--export-width={width}', f'--export-height={height}', svgName])

    os.remove(svgName)

def generatePermutations(name):

    tree = ET.parse(name + ".svg")
    permColors = itertools.permutations(colors)

    processList = []

    for i, c in enumerate(permColors):
        p = Process(target=generatePermutation, args=(name, tree, i, c))
        p.start()
        processList.append(p)

        if len(processList) >= PROCESS_COUNT:
            for p in processList:
                if not p.is_alive():
                    processList.remove(p)
            
            if len(processList) >= PROCESS_COUNT:
                while len(processList) >= PROCESS_COUNT:
                    p = processList[0]
                    p.join()
                    processList.remove(p)

if __name__ == '__main__':
    generatePermutations("dino")
    generatePermutations("cloud")