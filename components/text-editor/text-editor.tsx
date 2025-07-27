"use client";
import { Button } from "@/components/ui/button";
import { Editor, EditorContent } from "@tiptap/react";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import "./style.css";
import { MenuBar } from "./text-editor-menu";
import EditorBubbleMenu from "./UI/bubble-menu";

export default function DocumentEditor({ editor, editorHeight = '100px' }: { editor: Editor, editorHeight: string }) {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUploadUrl, setImageUploadUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      setOpen(false);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      return error;
    }
  };

  useEffect(() => {
    if (editor && transcription) {
      editor.commands.setContent(transcription); // Set editor content to transcription
    }
  }, [editor, transcription]);

  const html = editor?.getHTML();

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  const menuContainerRef = useRef(null);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col border borer-gray-300 dark:border-blue-50 ">
      <MenuBar editor={editor} />
      <EditorBubbleMenu editor={editor} />
      <EditorContent editor={editor} className="min-h-[200px]" />
    </div>
  );
}
