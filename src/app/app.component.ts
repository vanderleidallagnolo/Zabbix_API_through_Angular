import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//import { RequestInit, RequestRedirect } from 'node-fetch'; // For Node.js environments
// Or
//import { RequestInit, RequestRedirect }  from '@angular/common/http'; // For browser environments

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  //title = 'CodeSandbox';
  title = 'Zabbix through Angular';

  constructor(private http: HttpClient) {}

  /*
  onButtonClick() {
    this.http
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .subscribe((data) => {
        console.log(data);
        //alert(data);
      });
  }
  */

  getHosts() {
    const apiEndPointElement = document.getElementById(
      'apiEndpoint',
    ) as HTMLInputElement;
    const apiEndPoint = apiEndPointElement.value;

    const apiTokenElement = document.getElementById(
      'apiToken',
    ) as HTMLInputElement;
    const apiToken = apiTokenElement.value;

    //var apiEndPoint = document.getElementById('apiEndpoint');
    //var apiToken = document.getElementById('apiToken');

    // Verificar se os valores necessários estão presentes
    if (!apiEndPoint || !apiToken) {
      // Exibir mensagem de erro na tela se algum valor estiver ausente
      alert('API Endpoint e API Token são obrigatórios.');
      return;
    }
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var jsonData;

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      method: 'host.get',
      params: {
        output: ['hostid', 'name', 'host', 'status'],
        selectInterfaces: ['interfaceid', 'ip'],
        sortfield: 'name',
        sortorder: 'ASC',
      },
      id: 1,
      auth: apiToken,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      //redirect: 'follow',
    };

    fetch(apiEndPoint, requestOptions)
      .then((response) => response.text())
      .then((result) => this.printHostInTable(JSON.parse(result)))
      //.then((result) => alert(JSON.parse(result.toString())))
      .catch((error) => console.log('error', error));
  }

  printHostInTable(someJSON: any) {
    document.getElementById('hostsList')!.innerHTML = '';

    // Sort the JSON data by the host field in alphabetical order, ignoring case
    someJSON.result.sort((a: any, b: any) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    console.table(someJSON.result);

    // Create table element
    const table = document.createElement('table');
    table.style.border = '1px solid black';

    // Create header row
    const headerRow = document.createElement('tr');
    headerRow.style.backgroundColor = 'lightgray';

    const counterHeader = document.createElement('th');
    counterHeader.style.border = '1px solid black';
    counterHeader.innerHTML = '...';
    headerRow.appendChild(counterHeader);

    const nameHeader = document.createElement('th');
    nameHeader.style.border = '1px solid black';
    nameHeader.innerHTML = 'Name';
    headerRow.appendChild(nameHeader);

    const hostIdHeader = document.createElement('th');
    hostIdHeader.style.border = '1px solid black';
    hostIdHeader.innerHTML = 'Host ID';
    headerRow.appendChild(hostIdHeader);

    const hostHeader = document.createElement('th');
    hostHeader.style.border = '1px solid black';
    hostHeader.innerHTML = 'Host';
    headerRow.appendChild(hostHeader);

    const interfaceIdHeader = document.createElement('th');
    interfaceIdHeader.style.border = '1px solid black';
    interfaceIdHeader.innerHTML = 'Interface ID';
    headerRow.appendChild(interfaceIdHeader);

    const ipHeader = document.createElement('th');
    ipHeader.style.border = '1px solid black';
    ipHeader.innerHTML = 'IP';
    headerRow.appendChild(ipHeader);

    const statusHeader = document.createElement('th');
    statusHeader.style.border = '1px solid black';
    statusHeader.innerHTML = 'Status';
    headerRow.appendChild(statusHeader);

    table.appendChild(headerRow);
    console.table(someJSON.result);

    // Create data rows
    for (let i = 0; i < someJSON.result.length; i++) {
      const dataRow = document.createElement('tr');
      dataRow.style.backgroundColor = i % 2 == 0 ? 'white' : 'lightblue';

      const counterData = document.createElement('td');
      counterData.style.border = '1px solid black';
      counterData.innerHTML = (i + 1).toString();
      dataRow.appendChild(counterData);

      const nameData = document.createElement('td');
      nameData.style.border = '1px solid black';
      nameData.innerHTML = someJSON.result[i].name;
      dataRow.appendChild(nameData);

      const hostIdData = document.createElement('td');
      hostIdData.style.border = '1px solid black';
      hostIdData.innerHTML = someJSON.result[i].hostid;
      dataRow.appendChild(hostIdData);

      const hostData = document.createElement('td');
      hostData.style.border = '1px solid black';
      hostData.innerHTML = someJSON.result[i].host;
      dataRow.appendChild(hostData);

      const interfaceIdData = document.createElement('td');
      interfaceIdData.style.border = '1px solid black';
      interfaceIdData.innerHTML = someJSON.result[i].interfaces[0].interfaceid;
      dataRow.appendChild(interfaceIdData);

      const ipData = document.createElement('td');
      ipData.style.border = '1px solid black';
      ipData.innerHTML = someJSON.result[i].interfaces[0].ip;
      dataRow.appendChild(ipData);

      const statusData = document.createElement('td');
      statusData.style.border = '1px solid black';
      // Transforma 0 para "Enabled" e 1 para "Disabled"
      const statusValue =
        parseInt(someJSON.result[i].status, 10) === 0 ? 'Enabled' : 'Disabled';
      statusData.innerHTML = statusValue;
      //Muda a cor do Status
      statusData.style.color = statusValue === 'Enabled' ? 'green' : 'red';
      dataRow.appendChild(statusData);

      table.appendChild(dataRow);
    }

    document.getElementById('hostsList')!.appendChild(table);
  }
}
