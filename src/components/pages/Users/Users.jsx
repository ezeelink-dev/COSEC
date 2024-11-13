import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import UserIcon from "../../../assets/UserIcon.gif";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllUsers, getUserGroups } from "./UserHandler";
import { getAllDepartments } from "../Department/DepartmentHandler";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const ITEMS_PER_PAGE = 8;


export default function UserComponent() {
  const { toast } = useToast();

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(JSON.parse(Cookies.get("visibleColumns") || "[]") || ["User Name", "Email", "Contact"]);
  const [formData, setFormData] = useState({ userID: 0, fullname: "", username: "", userEmail: "", userContact: "", userPassword: "", department: null, UserGroupId: null, Gender: "", endDate: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const UserInfo = JSON.parse(sessionStorage.getItem("UserData"));
  const PCSGroupId = UserInfo?.user?.PCSGroupId;
  const PCSId = UserInfo?.user?.PCSId;
  const UserId = UserInfo?.user?.userID;
  const ClientId = UserInfo?.user?.ClientId;

  useEffect(() => {
    getAllUsers(UserId, PCSGroupId, PCSId, ClientId, setUsers);
    getAllDepartments(UserId, PCSGroupId, PCSId, ClientId, setDepartments);
    getUserGroups(UserId, PCSGroupId, PCSId, ClientId, setUserGroups);
  }, []);

  useEffect(() => {
    Cookies.set("visibleColumns", JSON.stringify(visibleColumns), { expires: 7 });
  }, [visibleColumns]);

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
      if (direction === "next" && prevPage < totalPages - 1) return prevPage + 1;
      if (direction === "prev" && prevPage > 0) return prevPage - 1;
      return prevPage;
    });
  };

  const filteredUsers = users && users.filter((user) => 
    user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.userContact?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedUsers = filteredUsers && filteredUsers.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const toggleColumnVisibility = (column) => {
    setVisibleColumns((prev) =>
      prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddUser = () => {
    setFormData({
      userID: 0,
      fullname: "",
      username: "",
      userEmail: "",
      userContact: "",
      userPassword: "",
      department: "",
      UserGroupId: "",
      Gender: "",
      endDate: ""
    });
    setDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setFormData({
      userID: user.userID,
      fullname: user.fullname,
      username: user.userName,
      userEmail: user.userEmail,
      userContact: user.userContact,
      userPassword: "",
      department: user.department,
      UserGroupId: user.UserGroupId,
      Gender: user.Gender,
      endDate: user.endDate
    });
    setDialogOpen(true);
  };

  const handleSaveUser = () => {
    // Implement save logic here
    setDialogOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center">
        <div className="ml-auto flex items-center gap-2 mb-3">
          <Input placeholder="Search Users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-xs" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["User Name", "Email", "Contact"].map((column) => (
                <DropdownMenuItem key={column}>
                  <Checkbox checked={visibleColumns.includes(column)} onCheckedChange={() => toggleColumnVisibility(column)} aria-label={`Toggle ${column} visibility`} />
                  <span className="ml-1">{column}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={handleAddUser} className="bg-blue-700 text-white hover:bg-blue-800 hover:text-white cursor-pointer"> + Add User </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-md md:max-w-lg lg:max-w-4xl w-full max-h-screen md:max-h-[90vh] overflow-y-scroll">
              <DialogHeader className="flex flex-row items-center gap-3">
                <img src={UserIcon} className="size-12 m-0 p-0" alt="User Icon" />
                <div className="text-left">
                  <DialogTitle>{formData.userID === 0 ? "Add New User" : "Edit User"}</DialogTitle>
                  <DialogDescription>Enter User details and click save to {formData.userID === 0 ? "add" : "update"}.</DialogDescription>
                </div>
              </DialogHeader>
              <div className="grid gap-6 py-4 px-3">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input id="fullname" value={formData.fullname} onChange={(e) => handleInputChange("fullname", e.target.value)} className="col-span-2" placeholder="Enter Full Name" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={formData.username} onChange={(e) => handleInputChange("username", e.target.value)} className="col-span-2" placeholder="Enter Username" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <Label htmlFor="userEmail">Email</Label>
                  <Input id="userEmail" value={formData.userEmail} onChange={(e) => handleInputChange("userEmail", e.target.value)} className="col-span-2" placeholder="Enter Email" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <Label htmlFor="userContact">Contact</Label>
                  <Input id="userContact" value={formData.userContact} onChange={(e) => handleInputChange("userContact", e.target.value)} className="col-span-2" placeholder="Enter Contact" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <Label htmlFor="userPassword">Password</Label>
                  <Input id="userPassword" type="password" value={formData.userPassword} onChange={(e) => handleInputChange("userPassword", e.target.value)} className="col-span-2" placeholder="Enter Password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <Label htmlFor="department">Department</Label>
                  <Select onValueChange={(value) => handleInputChange("department", value)} value={formData.department}>
                    <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Select Department">
                        {departments && departments?.find(dep => dep?.DepartmentId === formData?.department)?.DepartmentName || "Select Department"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {departments && departments?.map((dept) => (
                        <SelectItem key={dept.DepartmentId} value={dept.DepartmentId}>{dept.DepartmentName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <Label htmlFor="UserGroupId">UserGroup</Label>
                  <Select onValueChange={(value) => handleInputChange("UserGroupId", value)} value={formData.UserGroupId}>
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Select UserGroup">
                        {userGroups && userGroups?.find(group => group?.value === formData?.UserGroupId)?.label || "Select UserGroup"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {userGroups && userGroups?.map((group) => (
                        <SelectItem key={group.value} value={group.value}>{group.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <Label htmlFor="Gender">Gender</Label>
                  <Select onValueChange={(value) => handleInputChange("Gender", value)} value={formData.Gender}>
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => handleInputChange("endDate", e.target.value)} className="col-span-2" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSaveUser}>
                  {formData.userID === 0 ? "Save User" : "Update User"}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="w-full overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-neutral-600">Users</CardTitle>
          <CardDescription>Manage your Users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-hidden">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Sr No</TableHead>
                  {visibleColumns.includes("User Name") && <TableHead>User Name</TableHead>}
                  {visibleColumns.includes("Email") && <TableHead>Email</TableHead>}
                  {visibleColumns.includes("Contact") && <TableHead>Contact</TableHead>}
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers?.length > 0 ? (
                  paginatedUsers?.map((user, index) => (
                    <TableRow key={user.userID}>
                      <TableCell className="font-medium">{currentPage * ITEMS_PER_PAGE + index + 1}</TableCell>
                      {visibleColumns.includes("User Name") && <TableCell>{user.userName}</TableCell>}
                      {visibleColumns.includes("Email") && <TableCell>{user.userEmail}</TableCell>}
                      {visibleColumns.includes("Contact") && <TableCell>{user.userContact}</TableCell>}
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
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length + 2} className="text-center py-4">
                      No Users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Showing <strong>{currentPage * ITEMS_PER_PAGE + 1}</strong> to{" "}
            <strong>{Math.min((currentPage + 1) * ITEMS_PER_PAGE, filteredUsers.length)}</strong> of <strong>{filteredUsers.length}</strong> Users
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handlePageChange("prev")} disabled={currentPage === 0}>
              &lt; Previous
            </Button>
            <Button size="sm" variant="outline" onClick={() => handlePageChange("next")} disabled={(currentPage + 1) * ITEMS_PER_PAGE >= filteredUsers.length}>
              Next &gt;
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
