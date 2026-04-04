import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface MatrixDialogProps {
    fuelIndex: string;
    matrix: [[number, number], number, number][]
}

export const MatrixDialog = ({ fuelIndex, matrix }: MatrixDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-[#0B2D72]">
                    Latest Fare Matrix
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%]! lg:max-w-[50%]!" style={{ fontFamily: "Helvetica Neue, Arial, Helvetica, sans-serif"}}>
                <DialogTitle className="font-bold text-[#0B2D72] text-lg">Latest Fare Matrix</DialogTitle>
                <DialogDescription>
                    Based on Tagum City's City Ordinance 1020, series of 2023
                </DialogDescription>
                <Table>
                    <TableCaption className="text-green-500 font-bold">
                        * Current gasoline price per liter
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Gasoline Price per Liter</TableHead>
                            <TableHead className="text-center">Regular Fare</TableHead>
                            <TableHead className="text-center leading-tight">Student / Senior Citizen <br /> Person with Disability</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {matrix.map((row, i) => (
                            <TableRow className={`text-center ${i === Number(fuelIndex) ? "font-bold text-green-500" : ""}`} key={i}>
                                <TableCell>{i === 8 ? `Php ${row[0][0]} and up` : `Php ${row[0][0]} - ${row[0][1]}`}</TableCell>
                                <TableCell>{`Php ${row[1]}`}</TableCell>
                                <TableCell>{`Php ${row[2]}`}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <DialogFooter >
                    The above rate shall be applicable for the first three (3) kilometers and an additional of two pesos (Php 2.00) shall be charged to the succeeding kilometer and a fraction thereof.
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}