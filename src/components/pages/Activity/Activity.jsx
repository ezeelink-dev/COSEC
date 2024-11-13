import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ActivityIcon from "../../../assets/ActivityIcon.gif";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllActivity } from "./ActivityHandler";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ITEMS_PER_PAGE = 8;

export default function Activity() {
  const { toast } = useToast();

  const [Activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(JSON.parse(Cookies.get("visibleColumns") || "[]") || ["Activity Name"]);
  const [formData, setFormData] = useState({
    activity_id: 0,
    activity_desc: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const UserInfo = JSON.parse(sessionStorage.getItem("UserData"));
  const PCSGroupId = UserInfo?.user?.PCSGroupId;
  const PCSId = UserInfo?.user?.PCSId;
  const UserId = UserInfo?.user?.userID;
  const ClientId = UserInfo?.user?.ClientId;

  useEffect(() => {
    getAllActivity(UserId, PCSGroupId, PCSId, ClientId, setActivities);
  }, []);

  useEffect(() => {
    Cookies.set("visibleColumns", JSON.stringify(visibleColumns), { expires: 7 });
  }, [visibleColumns]);

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
      if (direction === "next" && prevPage < totalPages - 1) return prevPage + 1;
      if (direction === "prev" && prevPage > 0) return prevPage - 1;
      return prevPage;
    });
  };

  const filteredActivities = Activities && Activities.filter((Activity) =>
    Activity.activity_desc?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedActivities = filteredActivities.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const toggleColumnVisibility = (column) => {
    setVisibleColumns((prev) =>
      prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddActivity = () => {
    setFormData({ activity_id: 0, activity_desc: "" });
    setDialogOpen(true);
  };

  const handleEditActivity = (Activity) => {
    setFormData({
      activity_id: Activity.activity_id,
      activity_desc: Activity.activity_desc,
    });
    setDialogOpen(true);
  };

  const handleSaveActivity = () => {
    // Send formData to backend
    setDialogOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center">
        <div className="ml-auto flex items-center gap-2 mb-3">
          <Input
            placeholder="Search Activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["Activity Name"].map((column) => (
                <DropdownMenuItem key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onCheckedChange={() => toggleColumnVisibility(column)}
                    aria-label={`Toggle ${column} visibility`}
                  />
                  <span className="ml-1">{column}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={handleAddActivity} className="bg-blue-700 text-white hover:bg-blue-800 hover:text-white cursor-pointer"> + Add Activity </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-md md:max-w-lg lg:max-w-4xl w-full max-h-screen md:max-h-[90vh] overflow-y-scroll">
              <DialogHeader className="flex flex-row items-center gap-3">
                <img src={ActivityIcon} className="size-10 m-0 p-0" />
                <div className="text-left">
                  <DialogTitle>{formData.activity_id === 0 ? "Add New Activity" : "Edit Activity"}</DialogTitle>
                  <DialogDescription>Enter Activity details and click save to {formData.activity_id === 0 ? "add" : "update"}.</DialogDescription>
                </div>
              </DialogHeader>
              <div className="grid gap-6 py-4 px-3">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <Label htmlFor="activity_desc">Activity Name</Label>
                  <Input
                    id="activity_desc"
                    value={formData.activity_desc}
                    onChange={(e) => handleInputChange("activity_desc", e.target.value)}
                    className="col-span-2"
                    placeholder="Enter Activity Name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSaveActivity}>
                  {formData.activity_id === 0 ? "Save Activity" : "Update Activity"}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="w-full overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-neutral-600">Activities</CardTitle>
          <CardDescription>Manage your Activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-hidden">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Sr No</TableHead>
                  {visibleColumns.includes("Activity Name") && <TableHead>Activity Name</TableHead>}
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedActivities.length > 0 ? (
                  paginatedActivities.map((Activity, index) => (
                    <TableRow key={Activity.activity_id}>
                      <TableCell className="font-medium"> {currentPage * ITEMS_PER_PAGE + index + 1}</TableCell>
                      {visibleColumns.includes("Activity Name") && <TableCell>{Activity.activity_desc}</TableCell>}
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
                            <DropdownMenuItem onClick={() => handleEditActivity(Activity)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length + 1} className="text-center py-4">
                      No Activities found.
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
            <strong>{Math.min((currentPage + 1) * ITEMS_PER_PAGE, filteredActivities.length)}</strong> of <strong>{filteredActivities.length}</strong> Activities
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handlePageChange("prev")} disabled={currentPage === 0}>
              &lt; Previous
            </Button>
            <Button size="sm" variant="outline" onClick={() => handlePageChange("next")} disabled={(currentPage + 1) * ITEMS_PER_PAGE >= filteredActivities.length}>
              Next &gt;
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
