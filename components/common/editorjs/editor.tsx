import React, { useRef, useCallback } from "react";
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./tools";

const ReactEditorJS = createReactEditorJS();

export default function Editor({ data, setData }: { data: any; setData: any }) {
    const editorCore = useRef<any>(null);

    const handleInitialize = useCallback((instance: any) => {
        instance._editorJS.isReady
            .then(() => {
                console.log("Editor initialized");
                editorCore.current = instance;
            })
            .catch((err: any) => console.error("Editor init error:", err));
    }, []);

    const handleSave = useCallback(async () => {
        if (!editorCore.current) return;
        const savedData = await editorCore.current.save();
        console.log("Saved data:", savedData);
        setData(savedData);
    }, [setData]);

    return (
        <div className="editor-container min-h-[300px] border w-full rounded p-4 bg-white">
            <ReactEditorJS
                onInitialize={handleInitialize}
                tools={EDITOR_JS_TOOLS}
                onChange={handleSave}
                defaultValue={data}
            />
        </div>
    );
}
