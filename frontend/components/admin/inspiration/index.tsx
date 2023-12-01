"use client";
import Button from "@/components/button";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import Link from "next/link";
import InspirationTable from "./InspirationTable";
import { useAppSelector } from "@/store";
import { selectInspirationLoading } from "@/store/slices/inspiration";

export default function Inspiration() {
    const loading = useAppSelector(selectInspirationLoading);

    return(
        <main className="py-8 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="bg-light rounded-lg overflow-hidden">
                <AdminHeader 
                    backPath={'/admin'}
                    text={'Inspiration'}
                    options={
                        <Button 
                            className="py-2.5 px-3 mr-1.5"
                            href={'/admin/inspiration/create'}
                        >
                            Create post
                        </Button>
                    }
                />
                {!loading ? (
                    <>
                    <InspirationTable />
                    <div className="m-4">
                        <Link 
                            className="py-4 block text-center w-full border-[1px] border-light-tertiary rounded-md hover:bg-light-secondary transition-colors"
                            href={'/admin/inspiration/create'}
                        >
                            Create post
                        </Link>
                    </div>
                    </>
                ) : (
                    <span className="py-24 flex-1 flex items-center justify-center text-secondary/80">
                        Loading posts...
                    </span>
                )}
            </div>
        </main>
    )
}