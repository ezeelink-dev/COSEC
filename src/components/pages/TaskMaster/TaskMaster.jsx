import React, { useEffect, useState } from "react";
import { toast } from "sonner"
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import taskIcon from "../../../assets/taskicon.gif";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllTask } from "../TaskMaster/TaskHandler";
import { getAllActivity } from "../Activity/ActivityHandler"
import { getAllDocument } from "../Document/DocumentHandler";
import { getClientType, getTaskType } from "../../utils/fetchapi";
import { getAllDepartments } from "../Department/DepartmentHandler";
import { File, MoreHorizontal, MousePointer2, Plus, Trash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


const ITEMS_PER_PAGE = 8;

export default function Dashboard() {
  const { toast } = useToast()
  const [Tasks, setTasks] = useState([]);
  const [Activity, setActivity] = useState([]);
  const [Document, setDocument] = useState([]);
  const [TaskTypes, setTaskTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [Departments, setDepartments] = useState([]);
  const [ClientTypes, setClientTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("tasks");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [ActivitysearchTerm, setActivitySearchTerm] = useState('');
  const [currentActivityPage, setCurrentActivityPage] = useState(1);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false)
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showMainActivityDialog, setShowMainActivityDialog] = useState(false);
  const [ActivityMainVisibleColumns, setActivityMainVisibleColumns] = useState(JSON.parse(Cookies.get("ActivityMainVisibleColumns") || "[]") || ["activity_desc"]);
  const [currentMainActivityPage, setCurrentMainActivityPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(JSON.parse(Cookies.get("visibleColumns") || "[]") || ["task_desc", "TaskTypeDesc", "DepartmentName", "CreatedOn"]);
  const [formData, setFormData] = useState({ isNewClientTask: false, isIncClientTask: false, isRecurringTask: false, taskName: "", department: null, clienttype: null, taskType: null, requiredTime: "", activities: [] });
  const [MainActivityFormData, setMainActivityFormData] = useState({ activityName: "", activityRequiredTime: "" });

  const UserInfo = JSON.parse(sessionStorage.getItem("UserData"));
  const PCSGroupId = UserInfo?.user?.PCSGroupId;
  const PCSId = UserInfo?.user?.PCSId;
  const UserId = UserInfo?.user?.userID;
  const ClientId = UserInfo?.user?.ClientId;

  // Getters  ------------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    getAllTask(UserId, PCSGroupId, PCSId, ClientId, setTasks);
    getAllActivity(UserId, PCSGroupId, PCSId, ClientId, setActivity);
    getAllDocument(UserId, PCSGroupId, PCSId, ClientId, setDocument);
    getAllDepartments(UserId, PCSGroupId, PCSId, ClientId, setDepartments)
    getClientType(UserId, PCSGroupId, PCSId, ClientId, setClientTypes)
    getTaskType(UserId, PCSGroupId, PCSId, ClientId, setTaskTypes)
  }, [UserId, PCSGroupId, PCSId, ClientId]);

  useEffect(() => {
    Cookies.set("visibleColumns", JSON.stringify(visibleColumns), { expires: 7 });
    Cookies.set("ActivityMainVisibleColumns", JSON.stringify(ActivityMainVisibleColumns), { expires: 7 });
  }, [visibleColumns, ActivityMainVisibleColumns]);


  // Task filters and Pagination  ------------------------------------------------------------------------------------------------------------------------------
  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
      if (direction === "next" && prevPage < totalPages - 1) return prevPage + 1;
      if (direction === "prev" && prevPage > 0) return prevPage - 1;
      return prevPage;
    });
  };

  const filteredTasks = Tasks.filter(task => task.task_desc.toLowerCase().includes(searchQuery.toLowerCase()));
  const paginatedTasks = filteredTasks.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const toggleColumnVisibility = (column) => {
    setVisibleColumns((prev) =>
      prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]
    );
  };

  //Activity filter and Pagination -----------------------------------------------------------------------------------------------------------------
  const filteredActivities = Activity && Activity.filter(activity =>
    activity.activity_desc.toLowerCase().includes(ActivitysearchTerm.toLowerCase())
  );

  const paginatedActivities = filteredActivities.slice(
    (currentActivityPage - 1) * ITEMS_PER_PAGE,
    currentActivityPage * ITEMS_PER_PAGE
  );

  const totalActivityPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);

  const handleNextActivityPage = () => {
    if (currentActivityPage < totalActivityPages) setCurrentActivityPage(currentActivityPage + 1);
  };

  const handlePreviousActivityPage = () => {
    if (currentActivityPage > 1) setCurrentActivityPage(currentActivityPage - 1);
  };

  // Main Activity filter and Pagination -----------------------------------------------------------------------------------------------------------------
  const filteredMainActivities = Activity && Activity.filter(activity =>
    activity.activity_desc.toLowerCase().includes(ActivitysearchTerm.toLowerCase())
  );

  const paginatedMainActivities = filteredMainActivities.slice(
    (currentMainActivityPage - 1) * ITEMS_PER_PAGE,
    currentMainActivityPage * ITEMS_PER_PAGE
  );

  const toggleActivityColumnVisibility = (column) => {
    setActivityMainVisibleColumns((prev) =>
      prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]
    );
  };

  const totalMainActivityPages = Math.ceil(filteredMainActivities.length / ITEMS_PER_PAGE);

  const handleNextMainActivityPage = () => {
    if (currentMainActivityPage < totalMainActivityPages) setCurrentMainActivityPage(currentMainActivityPage + 1);
  };

  const handlePreviousMainActivityPage = () => {
    if (currentMainActivityPage > 1) setCurrentMainActivityPage(currentMainActivityPage - 1);
  };


  // Input and Field change Handlers ---------------------------------------------------------------------------------------------------------------------
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleActivityChange = (index, field, value) => {
    const updatedActivities = [...formData?.activities];
    updatedActivities[index][field] = value;
    setFormData((prev) => ({ ...prev, activities: updatedActivities }));
  };

  const handleMainActivityInputChange = (field, value) => {
    setMainActivityFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddActivity = () => {
    setFormData((prev) => ({
      ...prev,
      activities: [...prev.activities, { srNo: prev.activities.length + 1, activityName: "", activityRequiredTime: "" }]
    }));
  };

  const handleDeleteActivity = (index) => {
    setFormData((prev) => {
      const updatedActivities = [...prev.activities];
      updatedActivities.splice(index, 1);
      updatedActivities.forEach((activity, i) => {
        activity.StartAfterId = i > 0 ? updatedActivities[i - 1].activity_id : null;
      });
      return {
        ...prev,
        activities: updatedActivities,
      };
    });
  };


  const handleActivitySelect = (selectedActivity) => {
    setFormData((prev) => {
      const activities = [...prev.activities];
      const isDuplicate = activities && activities.some(
        (activity) => activity.activity_id === selectedActivity.activity_id
      );
      if (isDuplicate) {
        toast({
          variant: "destructive",
          title: "Duplicate! Activity ",
          description: "Please do not add duplicate Activities",
        })
        return prev;
      }
      const newActivity = {
        activity_id: selectedActivity.activity_id,
        activityName: selectedActivity.activity_desc,
        StartAfterId: activities.length > 0 ? activities[activities.length - 1].activity_id : null,
        documents: []
      };
      activities.push(newActivity);
      return {
        ...prev,
        activities: activities,
      };
    });
    setShowActivityDialog(false);
  };


  // Document Add Modal -----------------------------------------------------------------------------------------------------------------

  const handleOpenDocumentPopover = (activity) => {
    setSelectedActivity(activity);
  };

  const handleSelectDocument = (document) => {
    const updatedActivities = formData && formData?.activities.map((activity) =>
      activity.activity_id === selectedActivity.activity_id
        ? { ...activity, documents: [...activity.documents, document] }
        : activity
    );
    setFormData({ ...formData, activities: updatedActivities });
    setShowDocumentDialog(false);
  };

  // Task Modal - Activity arrangement drag and drop handlers -----------------------------------------------------------------------------
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const updatedActivities = [...formData?.activities];
    const [removed] = updatedActivities.splice(draggedIndex, 1);
    updatedActivities.splice(index, 0, removed);
    updatedActivities.forEach((activity, idx) => {
      activity.StartAfterId = idx === 0 ? null : updatedActivities[idx - 1].activity_id;
    });
    setFormData({
      ...formData,
      activities: updatedActivities,
    });
  };

  //Edit Task Modal -----------------------------------------------------------------------------------------------------------------------------
  const handleEditTask = (task) => {
    setFormData(task);
    setShowActivityDialog(true);
  };

  const handleEditTaskSubmit = () => {
    console.log(formData);
  };

  //Edit Activity Modal -----------------------------------------------------------------------------------------------------------------------------
  const handleEditActivity = (activity) => {
    setFormData(activity);
    setShowActivityDialog(true);
  };

  const handleActivitySubmit = () => {
    console.log(formData);
  };

  // Selection Name Handlers -----------------------------------------------------------------------------------------------------------------------------
  const selectedDepartment = Departments && Departments.find(
    (dept) => dept.DepartmentId === formData.department
  );

  const selectedClientType = ClientTypes && ClientTypes.find(
    (ct) => ct.value === formData.clienttype
  );

  const selectedTaskType = TaskTypes && TaskTypes.find(
    (tt) => tt.value === formData.taskType
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center">
        <div className="ml-auto flex items-center gap-2 mb-3">
          <Input placeholder="Search tasks..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(0) }} className="max-w-xs" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {currentTab === "tasks" ? (
                ["task_desc", "TaskTypeDesc", "DepartmentName", "CreatedOn"].map((column) => (
                  <DropdownMenuItem key={column}>
                    <Checkbox checked={visibleColumns.includes(column)} onCheckedChange={() => toggleColumnVisibility(column)} aria-label={`Toggle ${column} visibility`} />
                    <span className="ml-1">{column}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                ["activity_desc"].map((column) => (
                  <DropdownMenuItem key={column}>
                    <Checkbox checked={ActivityMainVisibleColumns.includes(column)} onCheckedChange={() => toggleActivityColumnVisibility(column)} aria-label={`Toggle ${column} visibility`} />
                    <span className="ml-1">{column}</span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-blue-700 text-white hover:bg-blue-800 hover:text-white cursor-pointer"> + Add Task </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md md:max-w-lg lg:max-w-4xl w-full max-h-screen md:max-h-[90vh] overflow-y-scroll">
              <DialogHeader className="flex flex-row items-center gap-3">
                <img src={taskIcon} className="size-12 m-0 p-0" />
                <div className="text-left">
                  <DialogTitle> Add New Task</DialogTitle>
                  <DialogDescription>Enter task details and click save to add it.</DialogDescription>
                </div>
              </DialogHeader>
              <div className="grid gap-6 py-4 px-3">
                <div className="flex items-center justify-end">
                  <Checkbox checked={formData.isNewClientTask} onCheckedChange={(value) => handleInputChange('isNewClientTask', value)} id="newClientTask" />
                  <Label htmlFor="newClientTask" className="ml-1 mr-6">NewClient Task</Label>

                  <Checkbox checked={formData.isIncClientTask} onCheckedChange={(value) => handleInputChange('isIncClientTask', value)} id="incClientTask" />
                  <Label htmlFor="incClientTask" className="ml-1 mr-6">Incorporated Task</Label>

                  <Checkbox checked={formData.isRecurringTask} onCheckedChange={(value) => handleInputChange('isRecurringTask', value)} id="recurringTask" />
                  <Label htmlFor="recurringTask" className="ml-1 mr-6">Recurring Task</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <Label htmlFor="taskName">Task Name</Label>
                  <Input id="taskName" value={formData.taskName} onChange={(e) => handleInputChange('taskName', e.target.value)} className="col-span-2" placeholder="Enter Task Name" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label htmlFor="department">Client Type</label>
                  <Select
                    value={formData.clienttype ? formData.clienttype.toString() : ""}
                    onValueChange={(value) => handleInputChange('clienttype', parseInt(value, 10))}>
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Select Client Type">
                        {selectedClientType ? selectedClientType.label : "Select Client Type"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ClientTypes && ClientTypes.map((ct) => (
                        <SelectItem key={ct.value} value={ct.value.toString()}>
                          {ct.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label htmlFor="department">Department</label>
                  <Select
                    value={formData.department ? formData.department.toString() : ""}
                    onValueChange={(value) => handleInputChange('department', parseInt(value, 10))}>
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Select Department">
                        {selectedDepartment ? selectedDepartment.DepartmentName : "Select Department"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Departments && Departments.map((dept) => (
                        <SelectItem key={dept.DepartmentId} value={dept.DepartmentId.toString()}>
                          {dept.DepartmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label htmlFor="department">Task Type</label>
                  <Select value={formData.taskType ? formData.taskType.toString() : ""} onValueChange={(value) => handleInputChange('taskType', parseInt(value, 10))}>
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Select Task Type">
                        {selectedTaskType ? selectedTaskType.lable : "Select Task Type"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {TaskTypes && TaskTypes.map((tt) => (
                        <SelectItem key={tt.value} value={tt.value.toString()}>
                          {tt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <Label htmlFor="requiredTime">Required Time</Label>
                  <Input
                    id="requiredTime"
                    value={formData.requiredTime}
                    onChange={(e) => handleInputChange('requiredTime', e.target.value)}
                    className="col-span-2"
                    placeholder="Enter required time in Hours"
                  />
                </div>
              </div>

              <Table className="mt-4" >
                <TableHeader>
                  <TableRow>
                    <TableHead>Sr No</TableHead>
                    <TableHead>Activity Name</TableHead>
                    <TableHead>Start After</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData && formData?.activities.map((activity, index) => {
                    const startAfterActivity = formData && formData.activities.find((act) => act.activity_id === activity.StartAfterId);
                    return (
                      <TableRow key={activity.activity_id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index)}>
                        <TableCell className="cursor-move">{index + 1}</TableCell>
                        <TableCell> {activity.activityName} </TableCell>
                        <TableCell> {startAfterActivity ? startAfterActivity.activityName : "╰┈➤"}</TableCell>
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <File onClick={() => handleOpenDocumentPopover(activity)} className="cursor-pointer hover:text-blue-700 size-5" />
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Sr No</TableHead>
                                    <TableHead>Document Name</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {activity?.documents && activity?.documents.map((doc, docIndex) => (
                                    <TableRow key={doc.document_id}>
                                      <TableCell>{docIndex + 1}</TableCell>
                                      <TableCell>{doc.DocumentDesc}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>

                              <Button variant="secondary" className="w-full" size="sm" onClick={() => setShowDocumentDialog(true)}>
                                Select Document
                              </Button>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell className="cursor-pointer"><Trash onClick={() => handleDeleteActivity(index)} className="hover:text-red-700 size-5" /></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="w-full flex items-center justify-start ">
                <Button size="sm" variant="outline" className="mr-4 gap-2" onClick={handleAddActivity}> <Plus className="size-4" /> Add Activity</Button>
                <Button size="sm" variant="outline" onClick={() => setShowActivityDialog(true)} className="gap-2"><MousePointer2 className="size-4" /> Select Activity</Button>
              </div>

              <DialogFooter>
                <Button type="submit" onClick={() => { }}>Save Task</Button>
                <Button variant="outline" onClick={() => { }}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className='overflow-y-scroll max-h-[60vh]'>
          <DialogHeader>
            <DialogTitle>Select Activity</DialogTitle>
          </DialogHeader>
          <Input placeholder="Search Activities" value={ActivitysearchTerm} onChange={(e) => { setActivitySearchTerm(e.target.value); setCurrentActivityPage(1); }} className="mb-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sr No</TableHead>
                <TableHead>Activity Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedActivities && paginatedActivities.map((activity, index) => (
                <TableRow key={activity.activity_id} onClick={() => handleActivitySelect(activity)} className="cursor-pointer">
                  <TableCell>{(currentActivityPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                  <TableCell>{activity.activity_desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" onClick={handlePreviousActivityPage} disabled={currentActivityPage === 1}> Previous </Button>
            <span> Page {currentActivityPage} of {totalActivityPages} </span>
            <Button variant="outline" onClick={handleNextActivityPage} disabled={currentActivityPage === totalActivityPages}> Next </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivityDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showMainActivityDialog} onOpenChange={setShowMainActivityDialog}>
        <DialogContent className="overflow-y-scroll max-h-[60vh]">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4 px-3">
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
              <Label htmlFor="activityName">Activity Name</Label>
              <Input id="activityName" value={MainActivityFormData?.activityName} onChange={(e) => handleMainActivityInputChange('activityName', e.target.value)} className="col-span-2" placeholder="Enter Activity Name" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleActivitySubmit}>Save Activity</Button>
            <Button variant="outline" onClick={() => setShowMainActivityDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent className="overflow-y-scroll max-h-[60vh]">
          <DialogHeader>
            <DialogTitle>Select Document</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sr No</TableHead>
                <TableHead>Document Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Document && Document.map((document, index) => (
                <TableRow key={document.document_id} onClick={() => handleSelectDocument(document)} className="cursor-pointer">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{document.DocumentDesc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocumentDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Tabs defaultValue="tasks" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <Card className="w-full overflow-y-auto">
            <CardHeader>
              <CardTitle className='text-neutral-600'>Tasks</CardTitle>
              <CardDescription>Manage your Tasks.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-hidden">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sr No</TableHead>
                      {visibleColumns.includes("task_desc") && <TableHead>Task Name</TableHead>}
                      {visibleColumns.includes("TaskTypeDesc") && <TableHead>Task Type</TableHead>}
                      {visibleColumns.includes("DepartmentName") && <TableHead>Department</TableHead>}
                      {visibleColumns.includes("CreatedOn") && <TableHead>Created On</TableHead>}
                      <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTasks.length > 0 ? (
                      paginatedTasks.map((task, index) => (
                        <TableRow key={task.task_id}>
                          <TableCell>{currentPage * ITEMS_PER_PAGE + index + 1}</TableCell>
                          {visibleColumns.includes("task_desc") && <TableCell className="font-medium">{task.task_desc}</TableCell>}
                          {visibleColumns.includes("TaskTypeDesc") && <TableCell><Badge variant="outline">{task.TaskTypeDesc}</Badge></TableCell>}
                          {visibleColumns.includes("DepartmentName") && <TableCell>{task.DepartmentName}</TableCell>}
                          {visibleColumns.includes("CreatedOn") && <TableCell>{new Date(task.CreatedOn).toLocaleDateString()}</TableCell>}
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost"> <MoreHorizontal className="h-4 w-4" /> <span className="sr-only">Toggle menu</span> </Button>
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
                      <TableRow> <TableCell colSpan={visibleColumns.length + 1} className="text-center py-4">No tasks found.</TableCell> </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground"> Showing <strong>{currentPage * ITEMS_PER_PAGE + 1}</strong> to{" "} <strong>{Math.min((currentPage + 1) * ITEMS_PER_PAGE, filteredTasks.length)}</strong> of <strong>{filteredTasks.length}</strong> Tasks </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handlePageChange("prev")} disabled={currentPage === 0}> &lt; Previous </Button>
                <Button size="sm" variant="outline" onClick={() => handlePageChange("next")} disabled={(currentPage + 1) * ITEMS_PER_PAGE >= filteredTasks.length}> Next &gt; </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card className="w-full overflow-y-auto">
            <CardHeader>
              <CardTitle className='text-neutral-600'>Activities</CardTitle>
              <CardDescription>Manage your Activities.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-hidden">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sr No</TableHead>
                      {ActivityMainVisibleColumns.includes("activity_desc") && <TableHead>Activity Name</TableHead>}
                      <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMainActivities.length > 0 ? ( paginatedMainActivities.map((Activity, index) => (
                        <TableRow key={Activity.activity_id}>
                          <TableCell className="font-medium"> {currentMainActivityPage * ITEMS_PER_PAGE + index + 1}</TableCell>
                          {ActivityMainVisibleColumns.includes("activity_desc") && <TableCell>{Activity.activity_desc}</TableCell>}
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost"> <MoreHorizontal className="h-4 w-4" /> <span className="sr-only">Toggle menu</span> </Button>
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
                      <TableRow> <TableCell colSpan={ActivityMainVisibleColumns.length + 1} className="text-center py-4"> No Activities found. </TableCell> </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                Showing <strong>{currentMainActivityPage * ITEMS_PER_PAGE + 1}</strong> to{" "}
                <strong>{Math.min((currentMainActivityPage + 1) * ITEMS_PER_PAGE, filteredMainActivities.length)}</strong> of <strong>{filteredMainActivities.length}</strong> Activities
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handlePreviousMainActivityPage()} disabled={currentMainActivityPage === 0}>
                  &lt; Previous
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleNextMainActivityPage()} disabled={(currentMainActivityPage + 1) * ITEMS_PER_PAGE >= filteredMainActivities.length}>
                  Next &gt;
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>


    </div>
  );
}
