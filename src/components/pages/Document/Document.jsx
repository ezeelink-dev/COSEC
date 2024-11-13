import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DocumentIcon from "../../../assets/DocumentIcon.gif";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllDocument } from "./DocumentHandler";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Editor } from '@tinymce/tinymce-react';

const ITEMS_PER_PAGE = 8;

export default function DocumentComponent() {
  const { toast } = useToast();

  const [documents, setDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(JSON.parse(Cookies.get("visibleColumns") || "[]") || ["Document Name"]);
  const [formData, setFormData] = useState({ DocumentID: 0, DocumentDesc: "", Templates: [] });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templateFormData, setTemplateFormData] = useState({ name: "", content: "" });

  const UserInfo = JSON.parse(sessionStorage.getItem("UserData"));
  const PCSGroupId = UserInfo?.user?.PCSGroupId;
  const PCSId = UserInfo?.user?.PCSId;
  const UserId = UserInfo?.user?.userId;
  const ClientId = UserInfo?.user?.ClientId;

  useEffect(() => {
    getAllDocument(UserId, PCSGroupId, PCSId, ClientId, setDocuments);
  }, []);

  useEffect(() => {
    Cookies.set("visibleColumns", JSON.stringify(visibleColumns), { expires: 7 });
  }, [visibleColumns]);

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
      if (direction === "next" && prevPage < totalPages - 1) return prevPage + 1;
      if (direction === "prev" && prevPage > 0) return prevPage - 1;
      return prevPage;
    });
  };

  const filteredDocuments = documents && documents.filter((document) => document.DocumentDesc?.toLowerCase().includes(searchQuery.toLowerCase()) );
  const paginatedDocuments = filteredDocuments && filteredDocuments.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const toggleColumnVisibility = (column) => {
    setVisibleColumns((prev) =>
      prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddDocument = () => {
    setFormData({ DocumentID: 0, DocumentDesc: "", Templates: [] });
    setDialogOpen(true);
  };

  const handleEditDocument = (document) => {
    setFormData({ DocumentID: document.DocumentID, DocumentDesc: document.DocumentDesc, Templates: document.Templates || [], });
    setDialogOpen(true);
  };

  const handleSaveDocument = () => {
    setDialogOpen(false);
  };

  const handleAddTemplate = () => {
    setTemplateFormData({ name: "", content: "" });
    setTemplateDialogOpen(true);
  };

  const handleEditTemplate = (template) => {
    setTemplateFormData({ name: template.name, content: template.content });
    setTemplateDialogOpen(true);
  };

  const handleSaveTemplate = () => {
    setFormData((prev) => ({
      ...prev,
      Templates: [...prev.Templates, templateFormData],
    }));
    setTemplateDialogOpen(false);
  };

  const handleDeleteTemplate = (template) => {
    setFormData((prev) => ({
      ...prev,
      Templates: prev.Templates.filter((t) => t !== template),
    }));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center">
        <div className="ml-auto flex items-center gap-2 mb-3">
          <Input placeholder="Search Documents..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-xs" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["Document Name"].map((column) => (
                <DropdownMenuItem key={column}>
                  <Checkbox checked={visibleColumns.includes(column)} onCheckedChange={() => toggleColumnVisibility(column)} aria-label={`Toggle ${column} visibility`} />
                  <span className="ml-1">{column}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={handleAddDocument} className="bg-blue-700 text-white hover:bg-blue-800 hover:text-white cursor-pointer"> + Add Document </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-md md:max-w-lg lg:max-w-4xl w-full max-h-screen md:max-h-[90vh] overflow-y-scroll">
              <DialogHeader className="flex flex-row items-center gap-3">
                <img src={DocumentIcon} className="size-10 m-0 p-0" alt="Document Icon" />
                <div className="text-left">
                  <DialogTitle>{formData.DocumentID === 0 ? "Add New Document" : "Edit Document"}</DialogTitle>
                  <DialogDescription>Enter Document details and click save to {formData.DocumentID === 0 ? "add" : "update"}.</DialogDescription>
                </div>
              </DialogHeader>
              <div className="grid gap-6 py-4 px-3">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <Label htmlFor="DocumentDesc">Document Name</Label>
                  <Input id="DocumentDesc" value={formData.DocumentDesc} onChange={(e) => handleInputChange("DocumentDesc", e.target.value)} className="col-span-2" placeholder="Enter Document Name" />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Edit Template</TableHead>
                      <TableHead>Delete Template</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData?.Templates?.map((template, index) => (
                      <TableRow key={index}>
                        <TableCell>{template.name}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleEditTemplate(template)}>Edit</Button>
                        </TableCell>
                        <TableCell>
                          <Trash2 variant="destructive" onClick={() => handleDeleteTemplate(template)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button onClick={handleAddTemplate}>Add Template</Button>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSaveDocument}>
                  {formData.DocumentID === 0 ? "Save Document" : "Update Document"}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
            <DialogContent className="max-w-4xl w-full max-h-screen md:max-h-[90vh] overflow-y-scroll">
              <DialogHeader>
                <DialogTitle>Add/Edit Template</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <Input
                  placeholder="Template Name"
                  value={templateFormData.name}
                  onChange={(e) => setTemplateFormData(prev => ({ ...prev, name: e.target.value }))}
                />
                <Editor
                  apiKey="21gc0ych8ucagmfywvcxkwoejz0reb3oczeblr6ukb9lablh"
                  value={templateFormData.content}
                  init={{
                    height: 550,
                    menubar: true,
                    plugins: [
                      "advlist", "autolink", "lists", "link", "image", "charmap", "preview", "anchor",
                      "searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media",
                      "table", "code", "help", "wordcount", "template",
                    ],
                    toolbar: "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                    content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
                  }}
                  onEditorChange={(content) => setTemplateFormData(prev => ({ ...prev, content }))}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleSaveTemplate}>Add Template</Button>
                <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="w-full overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-neutral-600">Documents</CardTitle>
          <CardDescription>Manage your Documents.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-hidden">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Sr No</TableHead>
                  {visibleColumns.includes("Document Name") && <TableHead>Document Name</TableHead>}
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDocuments?.length > 0 ? (
                  paginatedDocuments?.map((document, index) => (
                    <TableRow key={document.DocumentID}>
                      <TableCell className="font-medium"> {currentPage * ITEMS_PER_PAGE + index + 1}</TableCell>
                      {visibleColumns.includes("Document Name") && <TableCell>{document.DocumentDesc}</TableCell>}
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
                            <DropdownMenuItem onClick={() => handleEditDocument(document)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length + 1} className="text-center py-4">
                      No Documents found.
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
            <strong>{Math.min((currentPage + 1) * ITEMS_PER_PAGE, filteredDocuments.length)}</strong> of <strong>{filteredDocuments.length}</strong> Documents
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handlePageChange("prev")} disabled={currentPage === 0}>
              &lt; Previous
            </Button>
            <Button size="sm" variant="outline" onClick={() => handlePageChange("next")} disabled={(currentPage + 1) * ITEMS_PER_PAGE >= filteredDocuments.length}>
              Next &gt;
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
