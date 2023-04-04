import styled from "@emotion/styled";
import { Card } from "@mui/material";
import { grey } from "@mui/material/colors";
import { EditorContent } from "@tiptap/react";

export const TipTapEditor = styled(EditorContent)`
  width: 100%;

  .ProseMirror {
    outline: none !important;
    padding: 20px;
  }

  .ProseMirror h1 {
    font-weight: bold;
    font-size: 1.5rem;
  }
  .ProseMirror h2 {
    font-weight: bold;
    font-size: 1.25rem;
  }
  .ProseMirror h3 {
    font-weight: bold;
    font-size: 1.125rem;
  }
  .ProseMirror blockquote {
    border-left: 2px solid ${grey["500"]};
    padding: 0.5rem;
    font-style: italic;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    background-color: ${grey["100"]};
    display: block;
  }
  .ProseMirror ul ol {
    margin-left: 4.5rem;
  }
`;

export const EditorWrapper = styled(Card)`
  width: 100%;
`;
