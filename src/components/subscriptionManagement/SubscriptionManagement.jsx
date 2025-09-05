import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Tag,
  Tooltip,
  Dropdown,
  Space,
  Card,
  Divider,
  Radio,
  message
} from "antd";
import { FaTrash, FaCheck, FaEdit, FaFilePdf } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { MdBlock, MdGavel } from "react-icons/md";

const { Option } = Select;
const { TextArea: AntTextArea } = Input;
const { TextArea } = Input;

const components = {
  header: {
    row: (props) => (
      <tr
        {...props}
        style={{
          backgroundColor: "#f0f5f9",
          height: "50px",
          color: "secondary",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
    cell: (props) => (
      <th
        {...props}
        style={{
          color: "secondary",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
  },
};

const SubmissionManagement = () => {
  const [data, setData] = useState([
    {
      id: 1,
      initiatorName: "Dr. John Doe",
      email: "john.doe@email.com",
      respondentName: "Dr. Jane Smith",
      caseType: "Medical Malpractice",
      moderatorName: "Dr. Mike Johnson",
      jurorVote: "0 of 3",
      status: "Pending",

      submissionType: "Initial Submission",
      submittedDate: "2024-01-15",
      description: "Medical malpractice case regarding surgical procedure complications",
      juryFeedback: [],
      caseDetails: {
        patientInfo: "Patient Age: 45, Gender: Male",
        incidentDate: "2024-01-10",
        allegations: "Improper surgical procedure causing complications",
        evidence: "Medical records, surgical notes, witness statements"
      }
    },
    {
      id: 2,
      initiatorName: "Dr. Jane Smith",
      email: "jane.smith@email.com",
      respondentName: "Dr. Robert Brown",
      caseType: "Professional Conduct",
      moderatorName: "Dr. Sarah Wilson",
      jurorVote: "2 of 3",
      status: "Under Jury Review",
      submissionType: "Response Submission",
      submittedDate: "2024-02-01",
      description: "Response to allegations regarding patient care standards",
      juryFeedback: [
        { jurorId: 1, decision: "approve", reason: "Evidence supports the respondent's position" },
        { jurorId: 2, decision: "approve", reason: "Professional standards were maintained" }
      ],
      caseDetails: {
        incidentDate: "2024-01-25",
        allegations: "Unprofessional behavior with patient",
        evidence: "Patient complaints, staff testimonies"
      }
    },
    {
      id: 3,
      initiatorName: "Dr. Mike Johnson",
      email: "mike.johnson@email.com",
      respondentName: "Dr. Emily Davis",
      caseType: "Prescription Dispute",
      moderatorName: "Dr. David Miller",
      jurorVote: "3 of 3",
      status: "Final Review",
      submissionType: "Evidence Submission",
      submittedDate: "2024-01-20",
      description: "Additional evidence submission for ongoing case review",
      juryFeedback: [
        { jurorId: 1, decision: "approve", reason: "Clear evidence of proper prescription practices" },
        { jurorId: 2, decision: "approve", reason: "All medical protocols followed correctly" },
        { jurorId: 3, decision: "approve", reason: "No evidence of malpractice found" }
      ],
      caseDetails: {
        incidentDate: "2024-01-15",
        allegations: "Inappropriate prescription practices",
        evidence: "Prescription records, patient medical history"
      }
    }
  ]);

  const [searchText, setSearchText] = useState("");
  const [submissionType, setSubmissionType] = useState("All");
  const [isPDFModalVisible, setIsPDFModalVisible] = useState(false);
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
  const [isJuryModalVisible, setIsJuryModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [juryDecision, setJuryDecision] = useState("");
  const [juryReason, setJuryReason] = useState("");
  const [editForm] = Form.useForm();

  // Filter data
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.initiatorName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.caseType.toLowerCase().includes(searchText.toLowerCase()) ||
      item.submissionType.toLowerCase().includes(searchText.toLowerCase());

    const matchesType =
      submissionType === "All" || item.status === submissionType;

    return matchesSearch && matchesType;
  });

  // PDF Content Generator
  const generatePDFContent = (record) => {
    const caseTypeTemplates = {
      "Medical Malpractice": `
        <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
          <div style="text-align: center; border-bottom: 3px solid #1890ff; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #1890ff; margin: 0;">MEDICAL MALPRACTICE CASE REPORT</h1>
            <p style="color: #666; margin: 5px 0;">Case ID: ${record.id} | Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #1890ff; border-bottom: 2px solid #e6f7ff; padding-bottom: 10px;">Case Overview</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
              <div><strong>Initiator:</strong> ${record.initiatorName}</div>
              <div><strong>Respondent:</strong> ${record.respondentName}</div>
              <div><strong>Email:</strong> ${record.email}</div>
              <div><strong>Moderator:</strong> ${record.moderatorName}</div>
              <div><strong>Submission Date:</strong> ${record.submittedDate}</div>
              <div><strong>Status:</strong> <span style="background: ${getStatusColor(record.status)}; color: white; padding: 4px 8px; border-radius: 4px;">${record.status}</span></div>
            </div>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #1890ff;">Medical Case Details</h3>
            <p><strong>Patient Information:</strong> ${record.caseDetails?.patientInfo || 'Not specified'}</p>
            <p><strong>Incident Date:</strong> ${record.caseDetails?.incidentDate || 'Not specified'}</p>
            <p><strong>Allegations:</strong> ${record.caseDetails?.allegations || 'Not specified'}</p>
            <p><strong>Evidence:</strong> ${record.caseDetails?.evidence || 'Not specified'}</p>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #1890ff;">Case Description</h3>
            <div style="background: white; padding: 15px; border: 1px solid #d9d9d9; border-radius: 6px;">
              ${record.description}
            </div>
          </div>

          ${record.juryFeedback && record.juryFeedback.length > 0 ? `
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1890ff;">Jury Review (${record.jurorVote})</h3>
              ${record.juryFeedback.map((feedback, index) => `
                <div style="background: #f6ffed; border: 1px solid #b7eb8f; padding: 15px; border-radius: 6px; margin-bottom: 10px;">
                  <h4 style="margin: 0 0 10px 0; color: #389e0d;">Juror ${feedback.jurorId} Decision: ${feedback.decision.toUpperCase()}</h4>
                  <p style="margin: 0;"><strong>Reason:</strong> ${feedback.reason}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e6f7ff;">
            <p style="color: #666; font-size: 12px;">This document is confidential and for authorized personnel only</p>
          </div>
        </div>
      `,
      "Professional Conduct": `
        <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
          <div style="text-align: center; border-bottom: 3px solid #722ed1; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #722ed1; margin: 0;">PROFESSIONAL CONDUCT CASE REPORT</h1>
            <p style="color: #666; margin: 5px 0;">Case ID: ${record.id} | Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="background: #f9f0ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #722ed1; border-bottom: 2px solid #efdbff; padding-bottom: 10px;">Case Overview</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
              <div><strong>Initiator:</strong> ${record.initiatorName}</div>
              <div><strong>Respondent:</strong> ${record.respondentName}</div>
              <div><strong>Email:</strong> ${record.email}</div>
              <div><strong>Moderator:</strong> ${record.moderatorName}</div>
              <div><strong>Submission Date:</strong> ${record.submittedDate}</div>
              <div><strong>Status:</strong> <span style="background: ${getStatusColor(record.status)}; color: white; padding: 4px 8px; border-radius: 4px;">${record.status}</span></div>
            </div>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #722ed1;">Professional Conduct Details</h3>
            <p><strong>Incident Date:</strong> ${record.caseDetails?.incidentDate || 'Not specified'}</p>
            <p><strong>Allegations:</strong> ${record.caseDetails?.allegations || 'Not specified'}</p>
            <p><strong>Evidence:</strong> ${record.caseDetails?.evidence || 'Not specified'}</p>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #722ed1;">Case Description</h3>
            <div style="background: white; padding: 15px; border: 1px solid #d9d9d9; border-radius: 6px;">
              ${record.description}
            </div>
          </div>

          ${record.juryFeedback && record.juryFeedback.length > 0 ? `
            <div style="margin-bottom: 25px;">
              <h3 style="color: #722ed1;">Jury Review (${record.jurorVote})</h3>
              ${record.juryFeedback.map((feedback, index) => `
                <div style="background: #f6ffed; border: 1px solid #b7eb8f; padding: 15px; border-radius: 6px; margin-bottom: 10px;">
                  <h4 style="margin: 0 0 10px 0; color: #389e0d;">Juror ${feedback.jurorId} Decision: ${feedback.decision.toUpperCase()}</h4>
                  <p style="margin: 0;"><strong>Reason:</strong> ${feedback.reason}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #efdbff;">
            <p style="color: #666; font-size: 12px;">This document is confidential and for authorized personnel only</p>
          </div>
        </div>
      `,
      "Prescription Dispute": `
        <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
          <div style="text-align: center; border-bottom: 3px solid #13c2c2; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #13c2c2; margin: 0;">PRESCRIPTION DISPUTE CASE REPORT</h1>
            <p style="color: #666; margin: 5px 0;">Case ID: ${record.id} | Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="background: #e6fffb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #13c2c2; border-bottom: 2px solid #87e8de; padding-bottom: 10px;">Case Overview</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
              <div><strong>Initiator:</strong> ${record.initiatorName}</div>
              <div><strong>Respondent:</strong> ${record.respondentName}</div>
              <div><strong>Email:</strong> ${record.email}</div>
              <div><strong>Moderator:</strong> ${record.moderatorName}</div>
              <div><strong>Submission Date:</strong> ${record.submittedDate}</div>
              <div><strong>Status:</strong> <span style="background: ${getStatusColor(record.status)}; color: white; padding: 4px 8px; border-radius: 4px;">${record.status}</span></div>
            </div>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #13c2c2;">Prescription Case Details</h3>
            <p><strong>Incident Date:</strong> ${record.caseDetails?.incidentDate || 'Not specified'}</p>
            <p><strong>Allegations:</strong> ${record.caseDetails?.allegations || 'Not specified'}</p>
            <p><strong>Evidence:</strong> ${record.caseDetails?.evidence || 'Not specified'}</p>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #13c2c2;">Case Description</h3>
            <div style="background: white; padding: 15px; border: 1px solid #d9d9d9; border-radius: 6px;">
              ${record.description}
            </div>
          </div>

          ${record.juryFeedback && record.juryFeedback.length > 0 ? `
            <div style="margin-bottom: 25px;">
              <h3 style="color: #13c2c2;">Jury Review (${record.jurorVote})</h3>
              ${record.juryFeedback.map((feedback, index) => `
                <div style="background: #f6ffed; border: 1px solid #b7eb8f; padding: 15px; border-radius: 6px; margin-bottom: 10px;">
                  <h4 style="margin: 0 0 10px 0; color: #389e0d;">Juror ${feedback.jurorId} Decision: ${feedback.decision.toUpperCase()}</h4>
                  <p style="margin: 0;"><strong>Reason:</strong> ${feedback.reason}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #87e8de;">
            <p style="color: #666; font-size: 12px;">This document is confidential and for authorized personnel only</p>
          </div>
        </div>
      `
    };

    return caseTypeTemplates[record.caseType] || caseTypeTemplates["Medical Malpractice"];
  };

  // Show PDF Modal
  const showPDFModal = (record) => {
    setSelectedRecord(record);
    setIsPDFModalVisible(true);
  };

  // Show Accept Modal
  const showAcceptModal = (record) => {
    setSelectedRecord(record);
    setIsAcceptModalVisible(true);
  };

  // Show Jury Modal
  const showJuryModal = (record) => {
    setSelectedRecord(record);
    setIsJuryModalVisible(true);
  };

  // Show Edit Modal for 3 of 3 cases
  const showEditModal = (record) => {
    setSelectedRecord(record);
    editForm.setFieldsValue({
      finalDecision: '',
      adminComments: '',
      finalResult: ''
    });
    setIsEditModalVisible(true);
  };

  // Handle Accept (Send to Jury)
  const handleAcceptSubmit = () => {
    const updatedData = data.map((item) =>
      item.id === selectedRecord.id ? { ...item, status: "Sent to Jury" } : item
    );
    setData(updatedData);
    setIsAcceptModalVisible(false);
    message.success("Case sent to jury for review!");
  };

  // Handle Jury Decision
  const handleJurySubmit = () => {
    if (!juryDecision || !juryReason.trim()) {
      message.error("Please provide both decision and reason!");
      return;
    }

    const updatedData = data.map((item) => {
      if (item.id === selectedRecord.id) {
        const newFeedback = [...(item.juryFeedback || []), {
          jurorId: (item.juryFeedback?.length || 0) + 1,
          decision: juryDecision,
          reason: juryReason
        }];
        
        const newVoteCount = newFeedback.length;
        const newStatus = newVoteCount === 3 ? "Final Review" : "Under Jury Review";
        
        return {
          ...item,
          juryFeedback: newFeedback,
          jurorVote: `${newVoteCount} of 3`,
          status: newStatus
        };
      }
      return item;
    });
    
    setData(updatedData);
    setIsJuryModalVisible(false);
    setJuryDecision("");
    setJuryReason("");
    message.success("Jury decision submitted successfully!");
  };

  // Handle Final Edit
  const handleFinalEdit = () => {
    editForm.validateFields().then(values => {
      const updatedData = data.map((item) => {
        if (item.id === selectedRecord.id) {
          return {
            ...item,
            status: "Finalized",
            finalDecision: values.finalDecision,
            adminComments: values.adminComments,
            finalResult: values.finalResult
          };
        }
        return item;
      });
      
      setData(updatedData);
      setIsEditModalVisible(false);
      message.success("Final decision submitted successfully!");
    });
  };

  // Handle Reject
  const handleReject = (record) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'Do you want to reject this submission?',
      okText: 'Yes, Reject',
      cancelText: 'Cancel',
      onOk() {
        const updatedData = data.map((item) =>
          item.id === record.id ? { ...item, status: "Rejected" } : item
        );
        setData(updatedData);
        message.success("Submission rejected!");
      }
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
      case "Running":
        return "#52c41a";
      case "Rejected":
        return "#f5222d";
      case "Pending":
        return "#fa8c16";
      case "Under Review":
      case "Under Jury Review":
        return "#1890ff";
      case "Sent to Jury":
        return "#722ed1";
      case "Final Review":
        return "#13c2c2";
      case "Completed":
        return "#389e0d";
      case "Finalized":
        return "#389e0d";
      default:
        return "#d9d9d9";
    }
  };

  const columns = [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 60,
    },
    {
      title: "Initiator Name",
      dataIndex: "initiatorName",
      key: "initiatorName",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Respondent Name",
      dataIndex: "respondentName",
      key: "respondentName",
      align: "center",
    },
    {
      title: "Case Type",
      dataIndex: "caseType",
      key: "caseType",
      align: "center",
    },
    {
      title: "Moderator Name",
      dataIndex: "moderatorName",
      key: "moderatorName",
      align: "center",
    },
    {
      title: "Jury Vote",
      dataIndex: "jurorVote",
      key: "jurorVote",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          {/* PDF View Button */}
          <Tooltip title="View PDF">
            <Button
              type="primary"
              icon={<FaFilePdf />}
              onClick={() => showPDFModal(record)}
              size="small"
            >
              PDF
            </Button>
          </Tooltip>

          {/* Accept Button - Only for initial submissions */}
          {(record.status === "Running" || record.status === "Pending") && (
            <Tooltip title="Send to Jury">
              <Button
                onClick={() => showAcceptModal(record)}
                size="small"
                style={{
                  backgroundColor: "#52c41a",
                  borderColor: "#52c41a",
                  color: "white",
                }}
              >
                Accept
              </Button>
            </Tooltip>
          )}

          {/* Jury Review Button - For sent to jury cases */}
          {record.status === "Sent to Jury" && (
            <Tooltip title="Submit Jury Decision">
              <Button
                icon={<MdGavel />}
                onClick={() => showJuryModal(record)}
                size="small"
                style={{
                  backgroundColor: "#722ed1",
                  borderColor: "#722ed1",
                  color: "white",
                }}
              >
                Jury
              </Button>
            </Tooltip>
          )}

          {/* Edit Button - Only for 3 of 3 completed cases */}
          {record.status === "Final Review" && (
            <Tooltip title="Final Edit">
              <Button
                icon={<FaEdit />}
                onClick={() => showEditModal(record)}
                size="small"
                style={{
                  backgroundColor: "#13c2c2",
                  borderColor: "#13c2c2",
                  color: "white",
                }}
              >
                Edit
              </Button>
            </Tooltip>
          )}

          {/* Reject Button - For non-finalized cases */}
          {!["Rejected", "Finalized"].includes(record.status) && (
            <Tooltip title="Reject">
              <Button
                onClick={() => handleReject(record)}
                size="small"
                style={{
                  backgroundColor: "#f5222d",
                  borderColor: "#f5222d",
                  color: "white",
                }}
              >
                Reject
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center justify-between w-full gap-2">
          <Input
            placeholder="Search by name, email, case type, or submission type"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 350, height: 40 }}
          />

          <Select
            value={submissionType}
            onChange={setSubmissionType}
            style={{ width: 200, height: 40 }}
          >
            <Option value="All">All Status</Option>
            {/* <Option value="Running">Running</Option> */}
            <Option value="Pending">Pending</Option>
            {/* <Option value="Sent to Jury">Sent to Jury</Option> */}
            <Option value="Under Jury Review">Under Jury Review</Option>
            <Option value="Final Review">Final Review</Option>
            {/* <Option value="Finalized">Finalized</Option> */}
            <Option value="Rejected">Rejected</Option>
            <Option value="Completed">Completed</Option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Table
        components={components}
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{
          pageSize: 10,
          // showSizeChanger: true,
          // showQuickJumper: true,
          // showTotal: (total, range) =>
          //   `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 1400 }}
        className="custom-table"

      />

      {/* PDF Modal */}
      <Modal
        title={`PDF Report - ${selectedRecord?.caseType} Case`}
        visible={isPDFModalVisible}
        onCancel={() => setIsPDFModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsPDFModalVisible(false)}>
            Close
          </Button>,
          <Button 
            key="print" 
            type="primary" 
            onClick={() => window.print()}
          >
            Print PDF
          </Button>
        ]}
        width={900}
        style={{ top: 20 }}
      >
        {selectedRecord && (
          <div 
            dangerouslySetInnerHTML={{ 
              __html: generatePDFContent(selectedRecord) 
            }}
          />
        )}
      </Modal>

      {/* Accept Modal (Send to Jury) */}
      <Modal
        title="Send to Jury"
        visible={isAcceptModalVisible}
        onCancel={() => setIsAcceptModalVisible(false)}
        onOk={handleAcceptSubmit}
        width={600}
        okText="Send to Jury"
        cancelText="Cancel"
      >
        {selectedRecord && (
          <div className="space-y-4">
            <Card>
              <p className="text-lg mb-4">
                Are you sure you want to send this case to the jury for review?
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>Case Type:</strong> {selectedRecord.caseType}</div>
                  <div><strong>Initiator:</strong> {selectedRecord.initiatorName}</div>
                  <div><strong>Respondent:</strong> {selectedRecord.respondentName}</div>
                  <div><strong>Submission Type:</strong> {selectedRecord.submissionType}</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">
                  <strong>Note:</strong> Once sent to jury, 3 jurors will review this case and provide their decisions with detailed explanations.
                </p>
              </div>
            </Card>
          </div>
        )}
      </Modal>

      {/* Jury Decision Modal */}
      <Modal
        title="Jury Decision"
        visible={isJuryModalVisible}
        onCancel={() => {
          setIsJuryModalVisible(false);
          setJuryDecision("");
          setJuryReason("");
        }}
        onOk={handleJurySubmit}
        width={700}
        okText="Submit Decision"
        cancelText="Cancel"
      >
        {selectedRecord && (
          <div className="space-y-4">
            <Card title="Case Information">
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Case Type:</strong> {selectedRecord.caseType}</div>
                <div><strong>Initiator:</strong> {selectedRecord.initiatorName}</div>
                <div><strong>Respondent:</strong> {selectedRecord.respondentName}</div>
                <div><strong>Current Votes:</strong> {selectedRecord.jurorVote}</div>
              </div>
            </Card>

            <Card title="Your Decision">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Decision:</label>
                  <Radio.Group 
                    value={juryDecision} 
                    onChange={(e) => setJuryDecision(e.target.value)}
                    className="w-full"
                  >
                    <Space direction="vertical">
                      <Radio value="approve">Approve - Support the case/response</Radio>
                      <Radio value="reject">Reject - Do not support the case/response</Radio>
                    </Space>
                  </Radio.Group>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Detailed Explanation (Required):
                  </label>
                  <AntTextArea
                    value={juryReason}
                    onChange={(e) => setJuryReason(e.target.value)}
                    placeholder="Please provide a detailed explanation for your decision. This will be included in the case report."
                    rows={4}
                    maxLength={500}
                    showCount
                  />
                </div>
              </div>
            </Card>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-700 text-sm">
                <strong>Important:</strong> Your decision and explanation will be permanently recorded and included in the case documentation. Please ensure your reasoning is professional and well-founded.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Final Edit Modal */}
      <Modal
        title="Final Case Review & Decision"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleFinalEdit}
        width={800}
        okText="Submit Final Decision"
        cancelText="Cancel"
      >
        {selectedRecord && (
          <div className="space-y-4">
            <Card title="Case Summary">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><strong>Case Type:</strong> {selectedRecord.caseType}</div>
                <div><strong>Jury Votes:</strong> {selectedRecord.jurorVote}</div>
                <div><strong>Initiator:</strong> {selectedRecord.initiatorName}</div>
                <div><strong>Respondent:</strong> {selectedRecord.respondentName}</div>
              </div>
              
              {selectedRecord.juryFeedback && selectedRecord.juryFeedback.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: 12 }}>Jury Decisions:</h4>
                  {selectedRecord.juryFeedback.map((feedback, index) => (
                    <div key={index} className="mb-2 p-3 bg-gray-50 rounded">
                      <strong>Juror {feedback.jurorId}:</strong> 
                      <Tag color={feedback.decision === 'approve' ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                        {feedback.decision.toUpperCase()}
                      </Tag>
                      <p className="mt-1 text-sm text-gray-600">{feedback.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Form form={editForm} layout="vertical">
              <Form.Item
                name="finalDecision"
                label="Final Administrative Decision"
                rules={[{ required: true, message: 'Please select a final decision' }]}
              >
                <Radio.Group>
                  <Space direction="vertical">
                    <Radio value="case_approved">Case Approved - In favor of initiator</Radio>
                    <Radio value="case_dismissed">Case Dismissed - In favor of respondent</Radio>
                    <Radio value="partial_approval">Partial Approval - Mixed decision</Radio>
                    <Radio value="requires_revision">Requires Further Review</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="adminComments"
                label="Administrative Comments"
                rules={[{ required: true, message: 'Please provide administrative comments' }]}
              >
                <AntTextArea
                  placeholder="Provide detailed administrative comments based on jury feedback and case evidence..."
                  rows={4}
                  maxLength={1000}
                  showCount
                />
              </Form.Item>

              <Form.Item
                name="finalResult"
                label="Final Result & Actions"
                rules={[{ required: true, message: 'Please specify final result and actions' }]}
              >
                <AntTextArea
                  placeholder="Specify any actions to be taken, penalties, recommendations, or case closure details..."
                  rows={3}
                  maxLength={800}
                  showCount
                />
              </Form.Item>
            </Form>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-700 text-sm">
                <strong>Note:</strong> This final decision will be permanently recorded and the case will be marked as finalized. All parties will be notified of the outcome.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubmissionManagement;