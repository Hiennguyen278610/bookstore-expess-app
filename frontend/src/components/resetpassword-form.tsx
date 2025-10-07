import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";

export function ResetPasswordForm({className, ...props}: React.ComponentProps<"form">) {
    return (
        <form {...props} className={cn("flex flex-col gap-6", className)}>
            <div className="grid gap-2 text-center">
                <h1 className="font-mono bold text-2xl">Tạo mật khẩu mới</h1>
                <p className="text-sm text-muted-foreground">
                    Mật khẩu mới không được trùng với mật khẩu cũ của bạn.
                </p>
            </div>
            <div className="grid gap-3">
                <Label htmlFor="password">Mật khẩu mới</Label>
                <Input id="password" type="password" placeholder="Mật khẩu mới" />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Nhập lại mật khẩu mới</Label>
                <Input id="confirmPassword" type="password" placeholder="Nhập lại mật khẩu mới"/>
            </div>
            <Button type="submit" className="w-full mt-1 cursor-pointer">
                Đổi mật khẩu
            </Button>
        </form>
    )
}