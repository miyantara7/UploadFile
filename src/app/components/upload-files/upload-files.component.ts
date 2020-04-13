import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Materi } from 'src/app/model/materi';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {
  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message = '';
  dataMateri : Materi[]
  fileInfos: Observable<any>;

  constructor(private uploadService: UploadFileService) {
    this.gets()  
   }
  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();

  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    this.progress = 0;
  
    this.currentFile = this.selectedFiles.item(0);
    this.uploadService.upload(this.currentFile).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.fileInfos = this.uploadService.getFiles();
        }
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
      });
  
    this.selectedFiles = undefined;
  }

  gets(){
    let resp=this.uploadService.getMateri()
    resp.subscribe((data)=>this.dataMateri=data, err => console.log("Ada error : !"+ JSON.stringify(err)), 
    () => console.log("Completed !"));  
    console.log(this.dataMateri);
     
  }
}
