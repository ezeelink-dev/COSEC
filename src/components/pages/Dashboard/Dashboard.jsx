import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllDTTask } from "./DashboardHandler";
import { CheckCheck, Clock, ExternalLink, User2 } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger, } from "@/components/ui/menubar"

export default function Dashboard() {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [selectedTaskTypes, setSelectedTaskTypes] = useState([]);
    const [Tasks, setTasks] = useState([
        {
            "ActivityCount": 5,
            "RequiredTime": 52,
            "TimeTaken": null,
            "TaskAssignmentId": 24219,
            "PCSId": 1,
            "PCSGroupId": 1,
            "ClientId": 1045,
            "TaskId": 7,
            "CurrentPriorityId": 2,
            "CurrentStatusId": 2,
            "CurrentStatusBy": 1038,
            "CurrentStatusOn": "2024-10-30T16:08:49.900Z",
            "CurrentNotes": null,
            "AssignedByUserId": 1038,
            "AssignedOn": "2024-10-30T16:08:49.900Z",
            "ToStartOn": "2024-10-30T00:00:00.000Z",
            "ToCompleteBefore": "2024-10-31T00:00:00.000Z",
            "DepartmentId": 4,
            "AssignedUsers": "1035,1036,1039,1038",
            "CreatedBy": 1038,
            "CreatedOn": "2024-10-30T16:08:49.900Z",
            "IsTaskCompleted": false,
            "IsCancelledFlag": false,
            "DepartmentName": "Legal ",
            "TaskTypeDesc": "Adhoc",
            "TaskTypeId": 5,
            "task_desc": "Annual Fillings",
            "PriorityDesc": "Medium",
            "StatusDesc": "Assigned",
            "ClientName": "Abc",
            "userName": "ria.bafna",
            "fullname": "Ria Bafna",
            "AssignedByName": "ria.bafna",
            "CurrentStatusByName": "ria.bafna",
            "ActivityDetails": "[{\"ActivityAssignmentId\":25021,\"ActivityId\":28,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"CurrentPriorityId\":2,\"CurrentStatusId\":4,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"AssignedToUserId\":1036,\"OldActivityAssignmentId\":25021,\"OldAssignedToUserId\":1036,\"OldToStartOn\":\"2024-10-30T00:00:00\",\"OldToCompleteBefore\":\"2024-10-31T00:00:00\",\"OldPriorityId\":2,\"OldStatusId\":4,\"RequiredTime\":20},{\"ActivityAssignmentId\":25022,\"ActivityId\":29,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"CurrentPriorityId\":2,\"CurrentStatusId\":1,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"OldActivityAssignmentId\":25022,\"OldToStartOn\":\"2024-10-30T00:00:00\",\"OldToCompleteBefore\":\"2024-10-31T00:00:00\",\"OldPriorityId\":2,\"OldStatusId\":1},{\"ActivityAssignmentId\":25023,\"ActivityId\":36,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"CurrentPriorityId\":2,\"CurrentStatusId\":1,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"OldActivityAssignmentId\":25023,\"OldToStartOn\":\"2024-10-30T00:00:00\",\"OldToCompleteBefore\":\"2024-10-31T00:00:00\",\"OldPriorityId\":2,\"OldStatusId\":1},{\"ActivityAssignmentId\":25024,\"ActivityId\":65,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"CurrentPriorityId\":2,\"CurrentStatusId\":1,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"OldActivityAssignmentId\":25024,\"OldToStartOn\":\"2024-10-30T00:00:00\",\"OldToCompleteBefore\":\"2024-10-31T00:00:00\",\"OldPriorityId\":2,\"OldStatusId\":1},{\"ActivityAssignmentId\":25025,\"ActivityId\":81,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"CurrentPriorityId\":1,\"CurrentStatusId\":2,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"AssignedToUserId\":1035,\"OldActivityAssignmentId\":25025,\"OldAssignedToUserId\":1035,\"OldToStartOn\":\"2024-10-30T00:00:00\",\"OldToCompleteBefore\":\"2024-10-31T00:00:00\",\"OldPriorityId\":1,\"OldStatusId\":2,\"RequiredTime\":32}]",
            "AssignedUsersDetails": "[{\"AssignedToUserId\":1035},{\"AssignedToUserId\":1036}]",
            "UnAssigned": 3,
            "Assigned": 1,
            "ReAssigned": 0,
            "InProgress": 1,
            "OnHold": 0,
            "Approved": 0,
            "Rejected": 0,
            "Cancelled": 0,
            "Review": 0,
            "InReview": 0
        }, {
            "ActivityCount": 5,
            "RequiredTime": 52,
            "TimeTaken": null,
            "TaskAssignmentId": 2419,
            "PCSId": 1,
            "PCSGroupId": 1,
            "ClientId": 1045,
            "TaskId": 7,
            "CurrentPriorityId": 2,
            "CurrentStatusId": 2,
            "CurrentStatusBy": 1038,
            "CurrentStatusOn": "2024-10-30T16:08:49.900Z",
            "CurrentNotes": null,
            "AssignedByUserId": 1038,
            "AssignedOn": "2024-10-30T16:08:49.900Z",
            "ToStartOn": "2024-10-30T00:00:00.000Z",
            "ToCompleteBefore": "2024-10-31T00:00:00.000Z",
            "DepartmentId": 4,
            "AssignedUsers": "1035,1036,1039,1038",
            "CreatedBy": 1038,
            "CreatedOn": "2024-10-30T16:08:49.900Z",
            "IsTaskCompleted": false,
            "IsCancelledFlag": false,
            "DepartmentName": "Legal ",
            "TaskTypeDesc": "Adhoc",
            "TaskTypeId": 5,
            "task_desc": "Appointment of Director (in case of DIN)",
            "PriorityDesc": "Medium",
            "StatusDesc": "Assigned",
            "ClientName": "Abc",
            "userName": "ria.bafna",
            "fullname": "Ria Bafna",
            "AssignedByName": "ria.bafna",
            "CurrentStatusByName": "ria.bafna",
            "ActivityDetails": "[{\"ActivityAssignmentId\":25021,\"ActivityId\":28,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"CurrentPriorityId\":2,\"CurrentStatusId\":4,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"AssignedToUserId\":1036,\"OldActivityAssignmentId\":25021,\"OldAssignedToUserId\":1036,\"OldToStartOn\":\"2024-10-30T00:00:00\",\"OldToCompleteBefore\":\"2024-10-31T00:00:00\",\"OldPriorityId\":2,\"OldStatusId\":4,\"RequiredTime\":20},{\"ActivityAssignmentId\":25022,\"ActivityId\":29,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"CurrentPriorityId\":2,\"CurrentStatusId\":1,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"OldActivityAssignmentId\":25022,\"OldToStartOn\":\"2024-10-30T00:00:00\",\"OldToCompleteBefore\":\"2024-10-31T00:00:00\",\"OldPriorityId\":2,\"OldStatusId\":1},{\"ActivityAssignmentId\":25023,\"ActivityId\":36,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"CurrentPriorityId\":2,\"CurrentStatusId\":1,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"OldActivityAssignmentId\":25023,\"OldToStartOn\":\"2024-10-30T00:00:00\",\"OldToCompleteBefore\":\"2024-10-31T00:00:00\",\"OldPriorityId\":2,\"OldStatusId\":1},{\"ActivityAssignmentId\":25024,\"ActivityId\":65,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"CurrentPriorityId\":2,\"CurrentStatusId\":1,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"OldActivityAssignmentId\":25024,\"OldToStartOn\":\"2024-10-30T00:00:00\",\"OldToCompleteBefore\":\"2024-10-31T00:00:00\",\"OldPriorityId\":2,\"OldStatusId\":1},{\"ActivityAssignmentId\":25025,\"ActivityId\":81,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"CurrentPriorityId\":1,\"CurrentStatusId\":2,\"ToStartOn\":\"2024-10-30T00:00:00\",\"ToCompleteBefore\":\"2024-10-31T00:00:00\",\"AssignedToUserId\":1035,\"OldActivityAssignmentId\":25025,\"OldAssignedToUserId\":1035,\"OldToStartOn\":\"2024-10-30T00:00:00\",\"OldToCompleteBefore\":\"2024-10-31T00:00:00\",\"OldPriorityId\":1,\"OldStatusId\":2,\"RequiredTime\":32}]",
            "AssignedUsersDetails": "[{\"AssignedToUserId\":1035},{\"AssignedToUserId\":1036}]",
            "UnAssigned": 3,
            "Assigned": 1,
            "ReAssigned": 0,
            "InProgress": 1,
            "OnHold": 0,
            "Approved": 0,
            "Rejected": 0,
            "Cancelled": 0,
            "Review": 0,
            "InReview": 0
        }
    ]);
    const [expandedTaskId, setExpandedTaskId] = useState(null);

    useEffect(() => {
        const getStoredData = (key) => { const data = JSON.parse(localStorage.getItem(key)) || {}; return data[key] || []; };
        setSelectedCompanies(getStoredData("Company"));
        setSelectedUsers(getStoredData("Users")); 
        setSelectedTaskTypes(getStoredData("TaskType"));
    }, []);

    useEffect(() => {
        if (selectedUsers.length && selectedCompanies.length && selectedStatus.length && selectedTaskTypes.length) {
            getAllDTTask( selectedUsers.join(","), selectedCompanies.join(","), selectedStatus.join(","), selectedTaskTypes.join(","), setTasks );
        }
    }, [selectedUsers, selectedCompanies, selectedStatus, selectedTaskTypes]);

    return (
        <div className="p-2 space-y-4">
            <div className="w-full flex flex-col sm:flex-row items-center justify-between">
                <h1 className="text-2xl font-bold ml-1 ">{Tasks && Tasks.length}  Tasks</h1>
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>Filter</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem> Apply All Filters <MenubarShortcut>⌘A</MenubarShortcut> </MenubarItem>
                            <MenubarItem> Reset Filters <MenubarShortcut>⌘R</MenubarShortcut> </MenubarItem>
                            <MenubarSeparator />
                            <MenubarSub>
                                <MenubarSubTrigger>Quick Filters</MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem>My Tasks</MenubarItem>
                                    <MenubarItem>Completed Tasks</MenubarItem>
                                    <MenubarItem>Pending Approval</MenubarItem>
                                    <MenubarItem>High Priority</MenubarItem>
                                </MenubarSubContent>
                            </MenubarSub>
                        </MenubarContent>
                    </MenubarMenu>

                    <MenubarMenu>
                        <MenubarTrigger>Company</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>All Companies</MenubarItem>
                            <MenubarSeparator />
                            <MenubarSub>
                                <MenubarSubTrigger>Select Company</MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem>ABC Corp</MenubarItem>
                                    <MenubarItem>XYZ Ltd</MenubarItem>
                                    <MenubarItem>Global Ventures</MenubarItem>
                                    <MenubarItem>Innovate Inc.</MenubarItem>
                                </MenubarSubContent>
                            </MenubarSub>
                        </MenubarContent>
                    </MenubarMenu>

                    <MenubarMenu>
                        <MenubarTrigger>Users</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>All Users</MenubarItem>
                            <MenubarSeparator />
                            <MenubarSub>
                                <MenubarSubTrigger>Select User</MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem>John Doe</MenubarItem>
                                    <MenubarItem>Jane Smith</MenubarItem>
                                    <MenubarItem>Alex Johnson</MenubarItem>
                                    <MenubarItem>Emily Davis</MenubarItem>
                                </MenubarSubContent>
                            </MenubarSub>
                        </MenubarContent>
                    </MenubarMenu>

                    <MenubarMenu>
                        <MenubarTrigger>Status</MenubarTrigger>
                        <MenubarContent>
                            <MenubarRadioGroup value="all">
                                <MenubarRadioItem value="all">All Statuses</MenubarRadioItem>
                                <MenubarRadioItem value="assigned">Assigned</MenubarRadioItem>
                                <MenubarRadioItem value="in-progress">In Progress</MenubarRadioItem>
                                <MenubarRadioItem value="completed">Completed</MenubarRadioItem>
                                <MenubarRadioItem value="on-hold">On Hold</MenubarRadioItem>
                                <MenubarRadioItem value="cancelled">Cancelled</MenubarRadioItem>
                            </MenubarRadioGroup>
                        </MenubarContent>
                    </MenubarMenu>

                    <MenubarMenu>
                        <MenubarTrigger>Task Type</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>All Task Types</MenubarItem>
                            <MenubarSeparator />
                            <MenubarSub>
                                <MenubarSubTrigger>Select Task Type</MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem>Adhoc</MenubarItem>
                                    <MenubarItem>Project</MenubarItem>
                                    <MenubarItem>Review</MenubarItem>
                                    <MenubarItem>Approval</MenubarItem>
                                    <MenubarItem>Meeting</MenubarItem>
                                </MenubarSubContent>
                            </MenubarSub>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Tasks.map((task) => ( <TaskCard key={task.TaskAssignmentId} task={task} isExpanded={expandedTaskId === task.TaskAssignmentId} onToggleExpand={() => setExpandedTaskId(prevId => prevId === task.TaskAssignmentId ? null : task.TaskAssignmentId)} /> ))}
            </div>
        </div>
    );
}

function TaskCard({ task, isExpanded, onToggleExpand }) {
    const { task_desc, DepartmentName, TaskTypeDesc, RequiredTime, ActivityCount, PriorityDesc, StatusDesc, AssignedUsersDetails, ActivityDetails, fullname, } = task;
    const parsedActivityDetails = JSON.parse(ActivityDetails) || [];

    return (
        <div className="relative border border-gray-300 dark:border-gray-900 hover:shadow-lg transition-shadow duration-200 rounded-lg bg-gray-50 dark:bg-neutral-900">
            <Sheet>
                <SheetTrigger asChild>
                    <div className="mb-3 bg-blue-100 dark:bg-gray-800 space-y-2 px-5 py-3 cursor-pointer">
                        <div className="truncate font-medium text-base">{task_desc}</div>
                        <div className="flex gap-2 text-sm text-gray-500">
                            <Badge variant="default">{DepartmentName}</Badge>
                            <Badge variant="default">{TaskTypeDesc}</Badge>
                        </div>
                    </div>
                </SheetTrigger>
                <div className="px-5 py-2">
                    <div className="space-y-1">
                        <div className="flex text-sm items-center gap-2"> <User2 className="size-4" /> <span className="font-medium">Created By:</span> {fullname} </div>
                        <div className="flex text-sm items-center gap-2"> <Clock className="size-4" /> <span className="font-medium">Required Time:</span> {RequiredTime} </div>
                        <div className="flex text-sm items-center gap-2"> <CheckCheck className="size-4" /><span className="font-medium">Activities:</span> {ActivityCount} </div>
                    </div>
                    <div className="w-full flex items-center justify-between mt-5">
                        <Badge variant="destructive">{PriorityDesc}</Badge>
                        <Button onClick={onToggleExpand} variant="outline" size="sm"> <ExternalLink className="size-4" /> </Button>
                    </div>
                </div>
                <SheetContent className="overflow-y-scroll">
                    <SheetHeader>
                        <SheetTitle className="text-sm">Activity Details for {task_desc}</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-4 p-4">
                        {parsedActivityDetails.map((activity, index) => ( <ActivityCard key={index} activity={activity} /> ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

function ActivityCard({ activity }) {
    const { ActivityId, ToStartOn, ToCompleteBefore, CurrentPriorityId, CurrentStatusId, RequiredTime } = activity;
    return (
        <div className="p-5 border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300"> Activity ID: {ActivityId} </h3>
                <Badge variant="default" className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-700 dark:text-blue-100"> {CurrentStatusId} </Badge>
            </div>
            <div className="text-gray-700 text-sm dark:text-gray-300 space-y-1">
                <p className="flex items-center"> <span className="font-medium">Start Date:</span> &nbsp; {new Date(ToStartOn).toLocaleDateString()} </p>
                <p className="flex items-center"> <span className="font-medium">End Date:</span> &nbsp; {new Date(ToCompleteBefore).toLocaleDateString()} </p>
                <p className="flex items-center"> <span className="font-medium">Priority:</span> &nbsp; {CurrentPriorityId} </p>
                <p className="flex items-center"> <span className="font-medium">Required Time:</span> &nbsp; {RequiredTime} hrs </p>
            </div>
        </div>
    );
}
