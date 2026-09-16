/// <reference path="../typings/globals.d.ts" />
/// <reference path="../typings/png.d.ts" />
/// <reference path="../typings/wordpress__block-editor.d.ts" />
/// <reference path="../typings/wordpress__data.d.ts" />
/**
 * Internal Imports
 */
import "./style.scss";
import "./editor.scss";
import "./pro-host-api";

import { registerNativeBlocks } from "./blocks";

registerNativeBlocks();
