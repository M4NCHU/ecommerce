"use client";

import { uploadFiles } from "@/lib/uploadthing";
import { PostValidator } from "@/lib/validators/post";
import EditorJS from "@editorjs/editorjs";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";

type FormData = z.infer<typeof PostValidator>;

interface EditorProps {
  onSaveEditorData: (data: EditorData) => void;
}

const Editor: FC<EditorProps> = ({ onSaveEditorData }) => {
  const ref = useRef<EditorJS>();
  const [editorData, setEditorData] = useState<EditorData>({ blocks: [] });

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const _titleRef = useRef<HTMLTextAreaElement>(null);

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  // upload to uploadthing
                  const [res] = await uploadFiles({
                    files: [file],
                    endpoint: "imageUploader",
                  });

                  return {
                    success: 1,
                    file: {
                      url: res?.fileUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  // useEffect(() => {
  //   if (ref.current) {
  //     ref.current.save().then((outputData) => {
  //       const descriptionData = JSON.stringify(outputData);
  //       setDescription(descriptionData);
  //     });
  //   }
  // }, [ref, setDescription]);

  const previousData = useRef<EditorData>({ blocks: [] });
  const [editorActive, setEditorActive] = useState(false);
  const handleEditorFocus = () => {
    setEditorActive(true);
  };

  const handleEditorBlur = () => {
    setEditorActive(false);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (editorActive) {
      intervalId = setInterval(() => {
        checkEditorChanges();
      }, 2000); // Sprawdzaj co 2 sekundy (możesz dostosować ten czas)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [editorActive]);

  const checkEditorChanges = async () => {
    if (ref.current) {
      const outputData = await ref.current.save();
      if (JSON.stringify(outputData) !== JSON.stringify(previousData.current)) {
        setEditorData(outputData);
        onSaveEditorData(outputData);
        previousData.current = outputData; // Zaktualizuj poprzedni stan
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef?.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div
        className="w-full p-4 bg-background rounded-lg border border-zinc-200"
        onFocus={handleEditorFocus}
        onBlur={handleEditorBlur}
      >
        <div className="">
          <TextareaAutosize
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-default/20 rounded-lg p-2 text-5xl font-bold focus:outline-none"
          />
          <div id="editor" className="min-h-[500px] w-full" />
          <p className="text-sm text-gray-500">
            Use{" "}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{" "}
            to open the command menu.
          </p>
        </div>
      </div>
    </>
  );
};

export type EditorData = {
  // Define the type for editor data
  blocks: Array<any>;
  // Add other fields as needed
};

export default Editor;
