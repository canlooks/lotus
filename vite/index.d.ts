import {InputOption} from 'rollup'
import {PluginOption} from 'vite'

export type vitePluginMicroOptions = {
    entry?: InputOption
}

export default function vitePluginMicro(options?: vitePluginMicroOptions): PluginOption;