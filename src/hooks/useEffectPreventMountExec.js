import { useEffect, useRef } from "react"

export const useEffectPreventMountExec = (callback, dependencies = []) => {
    const mount = useRef(true);

    useEffect(() => {
        if(mount.current === false) {
            return callback();
        }
        mount.current = false;
    }, dependencies)
}