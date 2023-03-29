import { Box, Chip, Stack } from "@mui/material";
import {
  DescriptionContainer,
  ImageDate,
  ImageName,
  UploadButtonsContainer,
  UploadContainer,
  UploadDescription,
  UploadImage,
  UploadImageContainer,
  UploadImageDescription,
} from "./style";
import { BsImages, BsCloudUpload, BsTrash } from "react-icons/bs";
import { blue, grey } from "@mui/material/colors";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "../Button";
import { useEffect, useMemo, useRef, useState } from "react";
import format from "date-fns/format";
import { filesize } from "filesize";
import { api } from "../../../configs/api";
import Swal from "sweetalert2";
import getErrorMessage from "../../../helpers/getMessageError";

interface Props {
  disabled?: boolean;
  url: string;
  name: string;
  onFinish?: () => void;
}

export default function Upload({
  disabled = false,
  url,
  name,
  onFinish,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
  const [status, setStatus] = useState<"warning" | "success" | "error">(
    "warning"
  );
  const [imageSize, setImageSize] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : undefined;
  }, [thumbnail]);

  const [progress, setProgress] = useState<number>(0);

  function removeThumbnail() {
    URL.revokeObjectURL(thumbnail as any);
    setThumbnail(undefined);
    setStatus("warning");
  }
  function handleThumbnail(file: FileList | null) {
    if (file) {
      setThumbnail(file[0]);
    }
  }

  function calcSize(size: number): string {
    return filesize(size, { base: 2, standard: "jedec" }).toString();
  }

  function upload() {
    if (!thumbnail) {
      Swal.fire({
        title: "Atenção",
        text: "Não existe uma imagem para salvar",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (status === "error" && imageSize === 100) {
      Swal.fire({
        title: "Atenção",
        text: "Imagem muito grande",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    setIsLoading(true);
    const data = new FormData();
    data.append(name, thumbnail as Blob);
    api
      .post(url, data, {
        onUploadProgress: (progressEvent) => {
          const total: number = Math.round(
            (progressEvent.loaded * 100) / Number(progressEvent.total)
          );
          setProgress(total);
        },
      })
      .then((response) => {
        setProgress(0);
        setStatus("success");
        setIsLoading(false);
        Swal.fire({
          title: "Sucesso",
          text: response.data.message,
          icon: "success",
          confirmButtonColor: blue["500"],
        }).then((result) => {
          if (result.isConfirmed) {
            onFinish && onFinish();
          }
        });
      })
      .catch((error) => {
        setIsLoading(false);
        getErrorMessage({ error });
        setProgress(0);
      });
  }

  useEffect(() => {
    const size = filesize(!thumbnail ? 0 : thumbnail.size, {
      base: 2,
      standard: "jedec",
    });
    if (
      size.toString().toLowerCase().includes("mb") &&
      parseFloat(size as string) >= 1
    ) {
      setStatus("error");
      setImageSize(100);
    } else {
      setImageSize(parseFloat(size as string) / 10);
    }
  }, [thumbnail]);

  return (
    <UploadContainer disabled={disabled}>
      <UploadButtonsContainer
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}
        flexWrap="wrap"
        gap={2}
      >
        <Box display={"flex"} gap={1} flexWrap="wrap">
          <input
            hidden
            accept="image/*"
            type="file"
            ref={inputRef}
            onChange={(e) => {
              handleThumbnail(e.target.files);
            }}
          />
          <Button
            variant="contained"
            startIcon={<BsImages />}
            disabled={disabled}
            onClick={() => inputRef.current && inputRef.current.click()}
          >
            Selecionar
          </Button>
          <Button
            variant="contained"
            startIcon={<BsCloudUpload />}
            color="success"
            disabled={disabled}
            onClick={upload}
            loading={isLoading}
          >
            Upload
          </Button>
          <Button
            variant="contained"
            startIcon={<BsTrash />}
            color="error"
            disabled={disabled}
            onClick={removeThumbnail}
          >
            Remover
          </Button>
        </Box>
        <Stack direction={"row"} spacing={1} alignItems="center">
          <span style={{ fontSize: "13px", color: grey["600"] }}>
            {!thumbnail ? "0B" : calcSize(thumbnail.size)} / 1MB
          </span>{" "}
          <LinearProgress
            variant="determinate"
            value={imageSize}
            style={{
              width: "100px",
              height: 10,
              borderRadius: "5px",
              marginTop: "-2px",
            }}
            color={
              disabled
                ? "inherit"
                : imageSize === 100 && status === "error"
                ? "error"
                : "primary"
            }
          />
        </Stack>
      </UploadButtonsContainer>
      <LinearProgress
        variant="determinate"
        value={progress}
        color={disabled ? "inherit" : "primary"}
      />
      {thumbnail ? (
        <UploadImageContainer>
          <UploadImage src={preview} />
          <DescriptionContainer>
            <ImageName>{thumbnail.name}</ImageName>
            <ImageDate>{format(new Date(), "dd/MM/yyyy")}</ImageDate>
            <Chip
              label={
                (status === "error" && "Erro") ||
                (status === "success" && "Sucesso") ||
                (status === "warning" && "Aguardando")
              }
              color={status}
              variant="filled"
            />
          </DescriptionContainer>
        </UploadImageContainer>
      ) : (
        <UploadImageDescription>
          <BsImages color={grey["500"]} fontSize={45} />
          <UploadDescription>Selecione uma imagem</UploadDescription>
        </UploadImageDescription>
      )}
    </UploadContainer>
  );
}
