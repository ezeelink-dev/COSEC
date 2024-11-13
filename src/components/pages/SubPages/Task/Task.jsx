import React, { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const statusOptions = [
    { id: 1, label: "Backlog", count: 21 },
    { id: 2, label: "Todo", count: 21 },
    { id: 3, label: "In Progress", count: 20 },
    { id: 4, label: "Done", count: 19 },
    { id: 5, label: "Canceled", count: 19 },
];

import { File, ListFilter, MoreHorizontal, PlusCircle, ArrowDownUp } from "lucide-react";;

import { getAllTask } from "./TaskHandler";


export default function Task() {
    const applicationData = JSON.parse(sessionStorage.getItem("UserData"))
    const [userData, setUserData] = useState(applicationData.loginDetails);
    const [checkedStatuses, setCheckedStatuses] = useState({ Backlog: false, Todo: false, "In Progress": false, Done: false, Canceled: false, });
    const [allTasks, setAllTasks] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState("Name");
    const [sortOrder, setSortOrder] = useState("asc");
    const rowsPerPage = 10;

    const fetchAllTask = () => {
        getAllTask(userData.UserId, userData.PCSGroupId, userData.PCSId, userData.ClientId, setAllTasks)
    }

    useEffect(() => {
        fetchAllTask();
    }, [])

    const sortTasks = (tasks, field, order) => {
        return tasks.sort((a, b) => {
            const aField = a[field];
            const bField = b[field];
            if (aField < bField) return order === 'asc' ? -1 : 1;
            if (aField > bField) return order === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const sortedTasks = sortTasks([...allTasks], sortField, sortOrder);
    const handleSortChange = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handlePageChange = (e, page) => {
        e.preventDefault();
        setCurrentPage(page);
    };

    const handleStatusChange = (status) => {
        setCheckedStatuses((prev) => ({
            ...prev,
            [status]: !prev[status],
        }));
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentTasks = sortedTasks.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(allTasks && allTasks.length / rowsPerPage);

    return (
        <div className="h-full">
            <div className="flex flex-col sm:flex-row items-center mb-2">
                <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                                <ListFilter className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                            {statusOptions && statusOptions.map((option) => (
                                <DropdownMenuItem key={option.id} className="flex items-center space-x-2 py-1" onSelect={(e) => e.preventDefault()} >
                                    <Checkbox id={option.label} checked={checkedStatuses[option.label]} onCheckedChange={() => handleStatusChange(option.label)} />
                                    <label htmlFor={option.label} className="ml-2">
                                        {option.label} ({option.count})
                                    </label>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                                <ArrowDownUp className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Sort</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem checked={sortField === "Name"} onClick={() => handleSortChange("label")}> Name </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={sortField === "DepartmentName"} onClick={() => handleSortChange("DepartmentName")}> Department </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={sortField === "TaskTypeDesc"} onClick={() => handleSortChange("TaskTypeDesc")}> Type </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={sortField === "CreatedBy"} onClick={() => handleSortChange("CreatedBy")}> Created By </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                        <File className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                    </Button>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="sm" className="h-8 gap-1 bg-neutral-700">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only  sm:not-sr-only sm:whitespace-nowrap">Add Tasks</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[100%] sm:w-[100%] h-full sm:max-w-full" > 
                            <SheetHeader>
                                <SheetTitle>Edit profile</SheetTitle>
                                <SheetDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input id="name" value="Pedro Duarte" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                        Username
                                    </Label>
                                    <Input id="username" value="@peduarte" className="col-span-3" />
                                </div>
                            </div>
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button type="submit">Save changes</Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            <Card className="w-full overflow-y-auto">
                <CardHeader>
                    <CardTitle className='text-sky-600'>Tasks</CardTitle>
                    <CardDescription>Your Database of Tasks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full overflow-x-hidden">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden w-[100px] sm:table-cell"> Sr.No</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="hidden md:table-cell">Type</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentTasks.length > 0 ? (
                                    currentTasks.map((task, index) => (
                                        <TableRow key={task.task_id} >
                                            <TableCell className="hidden sm:table-cell">{index + 1}</TableCell>
                                            <TableCell>{task.label}</TableCell>
                                            <TableCell>{task.DepartmentName}</TableCell>
                                            <TableCell className="hidden md:table-cell">{task.TaskTypeDesc}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            No tasks available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" onClick={(e) => handlePageChange(e, currentPage > 1 ? currentPage - 1 : 1)} />
                                </PaginationItem>
                                {[...Array(Math.min(3, totalPages))].map((_, index) => (
                                    <PaginationItem key={index}>
                                        <PaginationLink href="#" isActive={index + 1 === currentPage} onClick={(e) => handlePageChange(e, index + 1)}>
                                            {index + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                {totalPages > 3 && currentPage <= totalPages - 1 && (<PaginationEllipsis />)}
                                {totalPages > 3 && (
                                    <PaginationItem>
                                        <PaginationLink href="#" isActive={currentPage === totalPages} onClick={(e) => handlePageChange(e, totalPages)} >
                                            {totalPages}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}

                                <PaginationItem>
                                    <PaginationNext href="#" onClick={(e) => handlePageChange(e, currentPage < totalPages ? currentPage + 1 : totalPages)} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>

                    </div>
                </CardContent>
                <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>1-10</strong> of <strong>32</strong> products
                    </div>
                </CardFooter>
            </Card>
        </div >
    );
}
