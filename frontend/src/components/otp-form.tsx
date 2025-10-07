import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export function OTPForm({className, ...props}: React.ComponentProps<"form">) {
    return (
        <form {...props} className={cn("flex flex-col gap-4", className)}>
            <div className="grid gap-2 text-center">
                <h1 className="font-mono bold text-2xl">Nhập mã xác minh</h1>
                <p className="text-sm text-muted-foreground">
                    Hãy nhập mã xác minh gồm 4 chữ số được gửi đến email của bạn.
                </p>
            </div>
            <div className="grid gap-3">
                <Input id="verified" type="text" placeholder="Mã xác minh..."/>
            </div>
            <Button type="submit" className="w-full cursor-pointer">
                Xác minh
            </Button>
            <a href="#" className="flex items-center justify-center underline underline-offset-4">
                Gửi lại mã xác minh
            </a>
        </form>
    )
}