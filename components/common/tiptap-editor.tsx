import { useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { ControllerRenderProps } from "react-hook-form";
import DocumentEditor from "../text-editor/text-editor";
import { extensions } from "../text-editor/text-editor-extension";

type TiptapFieldProps = {
    field: ControllerRenderProps<any, any>;
    editor: any;
};

export const RichTextEditorField = ({ field, }: TiptapFieldProps) => {
    const editor = useEditor({
        extensions,
        content: field.value || "", // initial value from form
        onUpdate({ editor }) {
            const html = editor.getHTML();
            field.onChange(html); // update form value
        },
        immediatelyRender: false,
    });

    // Set form value if editor changes externally
    useEffect(() => {
        if (editor && field.value !== editor.getHTML()) {
            editor.commands.setContent(field.value || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field.value]);

    if (!editor) return <></>;

    return (
        <DocumentEditor editor={editor} />
    );
};
