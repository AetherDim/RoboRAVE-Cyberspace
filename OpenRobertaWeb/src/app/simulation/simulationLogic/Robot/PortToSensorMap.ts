import { StringMap } from "../Utils";
import { SensorType } from "./Robot";

export interface PortToSensorMap extends StringMap<SensorType> {}