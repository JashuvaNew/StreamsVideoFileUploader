import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  uploadProgress: number =0;
  isUploading: boolean = false;
  serverFileStatus: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  this.checkServerStatus();
    
  }

  checkServerStatus(){
    this.http.get<{size:number}>('http://localhost:3000/api/status')
    .subscribe({
      next: (res) => {
        if(res.size > 0){
          const sizeMB = (res.size / (1024 * 1024)).toFixed(2);
           this.serverFileStatus = `Server has a file of size ${sizeMB} bytes.`;
        }
       
      },
      error: (err) => {
        this.serverFileStatus = 'No file on server.';
      }
    });
  }

 async onFileSelected(event:any){
    const file :File =event.target.files[0];

    if(!file){
      return
    }
    const chunkSize = 5*1024*1024; // 5MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    console.log(`Uploading ${file.name} in ${totalChunks} chunks.`);

    for(let chunkIndex=0; chunkIndex<totalChunks; chunkIndex++){
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      console.log(`Uploading chunk ${chunkIndex + 1} of ${totalChunks}`);
      await this.uploadChunk(chunk);

     this.uploadProgress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
      console.log(`Progress: ${this.uploadProgress}%`);
    }
    this.isUploading = false;
    console.log('Upload complete');
    
  

   
  }
 private uploadChunk(chunk: Blob): Promise<any> {{
    const headers = new HttpHeaders({'Content-Type': 'application/octet-stream'});
    return new Promise((resolve, reject) => {
       this.http.post('http://localhost:3000/api/upload', chunk, {headers, responseType: 'text'} )
    .subscribe({
    next: (res) =>resolve(res),
        error: (err) => reject(err)

    })
    });
  }

  
   
}
resetUpload() {
  console.log('Cleaning server file...');
  
  // We send an empty body {} because the server doesn't need data, just the signal.
  this.http.post('http://localhost:3000/api/clean', {}, { responseType: 'text' })
    .subscribe({
      next: (res) => {
        console.log(res); // Should say "Existing file deleted"
        this.uploadProgress = 0; // Reset UI bar to 0%
        alert('Server file deleted! You can upload again.');
      },
      error: (err) => console.error('Error cleaning file:', err)
    });
}

}
