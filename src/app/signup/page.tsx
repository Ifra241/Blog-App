    
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

    export default function signup(){
        return(

            <main className="min-h-screen flex items-center justify-center bg-gray-100">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Create an Account</CardTitle>

                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" placeholder="Enter Your Full Name" required/>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" placeholder="Enter Your Email" required/>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" placeholder="Enter Your Password" required/>
                            </div>


             <div className="space-y-2">
                   <Label htmlFor="confrim password">Confrim password</Label>
                                <Input id="confrim password" placeholder="Confrim Your Password" required/>
                            </div>

                            <Button type="submit" className="w-full">Sign Up</Button>
                            </form>
                            <p className="mt-4 text-center">
                                Already have an account?{" "}
                                <Link href="/signin" className="text-blue-600 font-semibold">Sign In</Link>
                            </p>

                    </CardContent>
                </Card>
                
            </main>
        );
    }