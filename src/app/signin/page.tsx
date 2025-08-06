import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";


export default function signin(){
    return(
        
        <main className="min-h-screen flex items-center justify-center bg-gray-100">

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Sign In to Your Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="Enter your Eamil" required/>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" placeholder="Enter your Password" required/>
                        </div>
                    
                    
                     <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-600">Sign Up</Button>

                        <div className="space-y-2">
                            <p className="text-center font-bold">OR</p>
                        </div>
                        <div>
                            <Button variant="secondary" className="w-full bg-blue-600 text-white text-md hover:bg-blue-500">Continue With Google</Button>
                        </div>
                        <div>
                            <p className="text-center mt-4">If You have no Account?{" "}
                                <Link href="/signup" className="text-blue-600 font-semibold">Sign Up</Link>
                            </p>
                        </div>


                    </form>


                </CardContent>
            </Card>
        </main>

    );
}