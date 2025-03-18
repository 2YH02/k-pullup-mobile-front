"use client";

import useAlertStore from "@/store/use-alert-store";
import { useState } from "react";
import { Button } from "../button/button";
import Dimmed from "../dimmed/dimmed";
import Loading from "../loading/loading";

interface Props {
  open?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  buttonLabel?: string;
  cancel?: boolean;
  contents?: React.ReactNode;
  onClick?: VoidFunction;
  onClickAsync?: () => Promise<void>;
}

const Alert = ({
  open,
  title,
  description,
  buttonLabel = "확인",
  cancel,
  contents,
  onClick,
  onClickAsync,
}: Props) => {
  const { closeAlert } = useAlertStore();
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleClick = async () => {
    if (onClickAsync) {
      setLoading(true);
      try {
        await onClickAsync();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else if (onClick) {
      onClick();
    }
  };

  if (contents) {
    return (
      <Dimmed onClick={closeAlert}>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 p-6
        overflow-hidden bg-white dark:bg-black rounded-lg z-40"
        >
          {contents}
        </div>
      </Dimmed>
    );
  }

  return (
    <Dimmed onClick={closeAlert}>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 p-6
        overflow-hidden bg-white dark:bg-black rounded-lg z-40"
      >
        <div className="block tesxt-lg font-bold mb-2">{title}</div>

        {description && <div className="text-sm">{description}</div>}

        {(onClick || cancel) && (
          <div className="flex justify-end mt-3">
            <div className="flex">
              {cancel && (
                <Button
                  onClick={closeAlert}
                  appearance="outlined"
                  className="flex items-center justify-center w-16 h-8 p-0 border-primary dark:bg-grey dark:border-none"
                  clickAction
                >
                  취소
                </Button>
              )}
              {(onClick || onClickAsync) && (
                <Button
                  onClick={handleClick}
                  className="ml-2 flex items-center justify-center w-16 h-8 p-0 bg-primary dark:bg-primary"
                  disabled={loading}
                  clickAction
                >
                  {loading ? (
                    <Loading className="text-white" size="sm" />
                  ) : (
                    buttonLabel
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Dimmed>
  );
};

export default Alert;
