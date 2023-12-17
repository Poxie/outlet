import { CloseIcon } from "@/assets/icons/CloseIcon";
import { ShareIcon } from "@/assets/icons/ShareIcon";
import Button from "@/components/button";
import { useModal } from "@/contexts/modal";
import { useScreenSize } from "@/hooks/useScreenSize";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function ImagePreviewModal({ src, path }: {
    src: string;
    path: string;
}) {
    const { close } = useModal();
    const screenSize = useScreenSize();
    const isSmall = ['xs'].includes(screenSize);

    const share = () => {
        navigator.share({ url: path })
            .then(console.log)
            .catch(console.error);
    }

    return(
        <div className={twMerge(
            "relative flex flex-col-reverse sm:flex-col",
            isSmall && 'h-full justify-between',
        )}>
            <div className="p-3 flex gap-3 items-center justify-between">
                <Button
                    onClick={share}
                    icon={<ShareIcon className="w-4 -mt-0.5" strokeWidth={2} />}
                    className={twMerge(
                        "py-3 px-3 flex-row-reverse text-sm",
                        isSmall && 'flex-1',
                    )}
                >
                    Dela
                </Button>
                <button
                    onClick={close}
                    aria-label={'Stäng förhandsvisning'}
                    className={twMerge(
                        "text-secondary rounded ",
                        !isSmall && 'aspect-square',
                        isSmall && "flex-1 p-3 hover:bg-light-secondary hover:text-primary transition-colors sm:bg-transparent bg-light-secondary hover:bg-light-tertiary/80" 
                    )}
                >
                    {!isSmall ? (
                        <CloseIcon className="w-8" />
                    ) : (
                        'Stäng'
                    )}
                </button>
            </div>
            <Image 
                src={src}
                width={800}
                height={800}
                alt=""
            />
        </div>
    )
}