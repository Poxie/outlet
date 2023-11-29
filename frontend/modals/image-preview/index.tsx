import { CloseIcon } from "@/assets/icons/CloseIcon";
import { ShareIcon } from "@/assets/icons/ShareIcon";
import Button from "@/components/button";
import { useModal } from "@/contexts/modal";
import Image from "next/image";

export default function ImagePreviewModal({ src, path }: {
    src: string;
    path: string;
}) {
    const { close } = useModal();

    const share = () => {
        navigator.share({ url: path })
            .then(console.log)
            .catch(console.error);
    }

    return(
        <div className="relative">
            <div className="p-3 flex items-center justify-between">
                <Button
                    onClick={share}
                    icon={<ShareIcon className="w-4 -mt-0.5" strokeWidth={2} />}
                    className="py-3 px-3 flex-row-reverse text-sm"
                >
                    Dela
                </Button>
                <button
                    onClick={close}
                    aria-label={'Säng förhandsvisning'}
                    className="aspect-square text-secondary rounded hover:bg-light-secondary hover:text-primary transition-colors"
                >
                    <CloseIcon className="w-8" />
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