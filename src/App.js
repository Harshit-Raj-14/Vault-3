import navlogo from './images/navlogo.png';
import ExploreMore from './components/ExploreMore.js';
import { Button } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Web3Storage } from "web3.storage";
import { useAccount, useContract, useSigner } from "wagmi";

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract";
import Footer from './components/Footer';

const client = new Web3Storage({
	token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI4ZTgzYzVlQjdmRmQxNzIxZTA0ODk1N0NlZjBBODlDRWZDNkZEZmYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODE0ODE3ODc5ODUsIm5hbWUiOiJWYXVsdDMifQ.ylTz-lCa5WdJVVUc0d6UCXQOU1DsWwfAzs8LNBwdFMI ",
});

function App() {
	const [files, setFiles] = useState(null);
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState(null);
	const [fileSize, setFileSize] = useState(null);
	const [fileType, setFileType] = useState(null);

	const { address } = useAccount();
	const { data: signer } = useSigner();
	const contract = useContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		signerOrProvider: signer,
	});

	console.log("CONTRACT ", contract);

	const captureFile = async (e) => {
		try {
			console.log(e.target.files)
			console.log(e.target.files[0].name);
			console.log(e.target.files[0].size);
			console.log(e.target.files[0].type);
			setFileName(e.target.files[0].name);
			setFile(e.target.files);
			setFileName(e.target.files[0].name);
			setFileSize(e.target.files[0].size);
			setFileType(e.target.files[0].type);
		} catch (err) {
			console.log(err);
		}
	};

	const uploadFile = async (e) => {
		e.preventDefault();
		console.log("UPLOADING...");
		if (file) {
			try {
				const uploadedFile = await client.put(file, {
					name: fileName,
					maxRetries: 3,
					wrapWithDirectory: false,
				});
				console.log(uploadedFile);

				const uploadTxn = await contract.uploadFile(
					uploadedFile?.toString(),
					fileSize?.toString(),
					fileType?.toString(),
					fileName?.toString()
				);
				// await uploadTxn.wait();
				console.log(uploadTxn);
				contract.on("FileUploaded", (fileId, fileHash, fileSize, fileType, fileName, uploadTime, uploader) => {
					alert(`Congratulations! Your file has been successfully uploaded 🥳.`)
					const file_obj = {
						id: fileId?.toString() ?? fileId,
						hash: fileHash,
						size: fileSize?.toString() ?? fileSize,
						type: fileType,
						name: fileName,
						uploadTime: uploadTime?.toString() ?? uploadTime
					}
					setFiles(prev => [...prev, file_obj])
				})
			} catch (err) {
				console.log(err);
			}
		} else {
			console.log("NO FILE FOUND!");
		}
	};

	const getFilesUploaded = async () => {
		try {
			const fileCount = await contract.fileCount();
			console.log(fileCount?.toString());
			let filesArr = [];
			for (let i = 0; i < +fileCount?.toString(); i++) {
				const file = await contract.files(address, i);
				const file_obj = {
					id: file[0]?.toString(),
					hash: file[1],
					size: file[2]?.toString(),
					type: file[3],
					name: file[4],
					uploadTime: new Date(file[5] * 1000).toLocaleDateString("en-US", {
						day: "numeric",
						month: "numeric",
						year: "numeric"
					})
				};
				filesArr.push(file_obj);
			}
			console.log(filesArr);
			setFiles(filesArr)
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (contract) {
			getFilesUploaded()
		}
	}, [contract])

	return (
		<div className="bg-black text-white"
			style={{ backgroundImage: 'linear-gradient(109.6deg, rgb(36, 45, 57) 11.2%, rgb(16, 37, 60) 51.2%, rgb(0, 0, 0) 98.6%)' }}>
			<div className="flex items-center justify-between flex-row px-20 py-8">
				{/* Logo */}
				<h1 className="text-3x1 font-extrabold" style={{ fontSize: '40px' }}><span><img src={navlogo} style={{ width: '48px', display: "inline-block", marginRight: "10px" }} /></span>
					Vault 3
					{/* <a href="https://github.com/Harshit-Raj-14/Vault-3" target="_blank" rel="noopener noreferrer">
							<Button
								size="lg"
								color="white"
								style={{ marginLeft: '0px', fontSize: '16px', marginLeft: "50px", display: "inline-block" }}
								className="flex items-center gap-1"
							>
								Github
							</Button></a> */}
					<ExploreMore />
				</h1>

				<ConnectButton />

			</div>


			<div className="relative justify-center text-center min-h-screen">
				<h1 className="vaultheading">Vault <span style={{ color: 'white' }}>everyone trusts</span></h1>
				<h3 className="text-2xl font-bold mt-2" style={{ fontStyle: "verdana", fontSize: "25px" }}>The safe, simple, and smart way to store your data</h3>
				<h1 className="text-4xl font-extrabold mt-8" style={{ fontStyle: "verdana", fontSize: "35px" }}>Upload Files</h1>

				{/* /////////////// */}

				{address && (
					<div className="flex flex-col items-center justify-center mb-8 mt-6">
						<form onSubmit={(e) => uploadFile(e)} className="px-4">
							<div className="mt-4 flex justify-between mx-4">
								<input
									className="hidden"
									type="file"
									id="filecap"
									onChange={(e) => captureFile(e)}
								/>
								<label
									htmlFor="filecap"
									className="cursor-pointer bg-white hover:bg-blue-500 text-blue-700 hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded font-bold dark:bg-gray-700 dark:text-gray-100 dark:border-gray-900 transform transition hover:scale-110"
								>
									{fileName ? fileName : "Choose a file"}
								</label>
								<button
									type="submit"
									style={{ marginLeft: "50px" }}
									className="py-2 px-4 rounded font-bold bg-white text-blue-700 border border-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-900 hover:border-transparent hover:bg-blue-500 hover:text-white transform transition hover:scale-110"
								>
									Upload!
								</button>
							</div>
						</form>
						{/* <button 
							className="my-4 py-2 px-4 rounded font-bold bg-white text-blue-700 border border-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-900 hover:border-transparent hover:bg-blue-500 hover:text-white transform transition hover:scale-110"
							onClick={getFilesUploaded}
						>
							Get Files
						</button> */}
						<div className="flex flex-col mx-6 my-8">
							<div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
								<div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
									<div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg dark:border-black">
										<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
											<thead className="bg-gray-50 dark:bg-blue-opaque">
												<tr className="border-b dark:border-gray-600">
													<th
														scope="col"
														className="px-6 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider"
													>
														id
													</th>
													<th
														scope="col"
														className="px-6 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider"
													>
														name
													</th>
													<th
														scope="col"
														className="px-6 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider"
													>
														type
													</th>
													<th
														scope="col"
														className="px-6 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider"
													>
														size
													</th>
													<th
														scope="col"
														className="px-6 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider"
													>
														date
													</th>
													<th
														scope="col"
														className="px-6 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider"
													>
														hash
													</th>
												</tr>
											</thead>
											{files?.length > 0 && files.map((file, key) => (
												<tbody
													className="bg-white dark:bg-blue-opaque divide-y divide-gray-200"
													key={key}
												>
													<tr>
														<td className="px-4 py-4 whitespace-nowrap">
															<div className="flex items-center">
																<div className="text-sm font-medium text-gray-900 ">
																	{file.id}.
																</div>
															</div>
														</td>
														<td className="px-4 py-4 whitespace-nowrap">
															<div className="text-sm text-gray-900 ">
																{file.name}
															</div>
														</td>
														<td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
															{file.type}
														</td>
														<td className="px-4 py-4 whitespace-nowrap">
															<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-pink-100 dark:text-pink-800">
																{(file.size / (1024 * 1024)).toFixed(2)} MB
															</span>
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
															{file.uploadTime}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
															<a
																href={
																	"https://ipfs.io/ipfs/" + file.hash
																}
																className="text-indigo-600 hover:text-indigo-900 dark:text-purple-400 dark:hover:text-purple-700"
																rel="noopener noreferrer"
																target="_blank"
															>
																{file.hash}
															</a>
														</td>
													</tr>
												</tbody>
											))}
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
}

export default App;
