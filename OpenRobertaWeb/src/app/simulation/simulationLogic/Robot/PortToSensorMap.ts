import { StringMap } from "../Util";
import { SensorType } from "./Robot";

export interface PortToSensorMap extends StringMap<SensorType> {}