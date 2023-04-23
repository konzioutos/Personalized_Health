/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import com.google.gson.Gson;
import database.tables.EditDoctorTable;
import database.tables.EditRandevouzTable;
import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import mainClasses.Doctor;
import mainClasses.Randevouz;
//import com.itextpdf.text.Document;
//import com.itextpdf.text.Paragraph;
//import com.itextpdf.text.pdf.PdfPCell;
//import com.itextpdf.text.pdf.PdfPTable;
//import com.itextpdf.text.pdf.PdfWriter;

/**
 *
 * @author KonZioutos
 */
public class Rendezvous extends HttpServlet {

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        HttpSession session = request.getSession();
        String username = null;
        if (session.getAttribute("loggedIn") != null) {
            username = session.getAttribute("loggedIn").toString();
        } else {
            response.setStatus(403);
            response.getWriter().println("Session error");
            return;
        }

        try {
            String action = request.getParameter("action");

            if (action.equalsIgnoreCase("donerandevouz")) {
                int randevouzId = Integer.parseInt(request.getParameter("randevouzid"));
                EditRandevouzTable ert = new EditRandevouzTable();
                ert.updateRandevouzStatus(randevouzId, "done");
                sendRandevouz(request, response, username);
            } else if (action.equalsIgnoreCase("cancelrandevouz")) {
                int randevouzId = Integer.parseInt(request.getParameter("randevouzid"));
                EditRandevouzTable ert = new EditRandevouzTable();
                ert.updateRandevouzStatus(randevouzId, "cancel");
                sendRandevouz(request, response, username);
            } else if (action.equalsIgnoreCase("getrandevouz")) {
                sendRandevouz(request, response, username);
            } else if (action.equalsIgnoreCase("addrandevouz")) {
                if (session.getAttribute("doctorId") == null) {
                    response.setStatus(403);
                    response.getWriter().println("You are not allowed to perform this action.");
                    return;
                }
                int doctorId = (int) session.getAttribute("doctorId");
                Date date = new Date();
                SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

                if (formatter.parse(request.getParameter("randevouzDatetime")).before(formatter.parse(formatter.format(date)))) {
                    response.setStatus(403);
                    response.getWriter().println("Please give a future date.");
                    return;
                }
                EditRandevouzTable ert = new EditRandevouzTable();
                if (ert.databaseToRandevouz(request.getParameter("randevouzDatetime")) != null) {
                    response.setStatus(403);
                    response.getWriter().println("Randevouz at that time is already added.");
                    return;
                }

                Randevouz rndv = new Randevouz();
                rndv.setDate_time(request.getParameter("randevouzDatetime"));
                rndv.setPrice(Integer.parseInt(request.getParameter("price")));
                rndv.setUser_id(0);
                rndv.setDoctor_id(doctorId);
                rndv.setStatus("free");

                ert.createNewRandevouz(rndv);

                //sendRandevouz(request, response, username);
            } else if (action.equalsIgnoreCase("savepdf")) {
                int table = Integer.parseInt(request.getParameter("valtable"));

//                Document document = new Document();
//
//                try {
//                    PdfWriter.getInstance(document,
//                            new FileOutputStream("HelloWorld-Table.pdf"));
//
//                    document.open();
//
//                    PdfPTable table = new PdfPTable(3); // 3 columns.
//
//                    PdfPCell cell1 = new PdfPCell(new Paragraph("Cell 1"));
//                    PdfPCell cell2 = new PdfPCell(new Paragraph("Cell 2"));
//                    PdfPCell cell3 = new PdfPCell(new Paragraph("Cell 3"));
//
//                    table.addCell(cell1);
//                    table.addCell(cell2);
//                    table.addCell(cell3);
//
//                    document.add(table);
//
//                    document.close();
//                } catch (Exception e) {
//
//                }
            } else {
                response.setStatus(403);
                return;
            }
        } catch (SQLException sqlexc) {
            response.setStatus(403);
            response.getWriter().println("Sql exception error.");
        } catch (ClassNotFoundException cnfexc) {
            response.setStatus(403);
            response.getWriter().println("Class not found error.");
        } catch (ParseException ex) {
            response.setStatus(403);
            response.getWriter().println("Date parse error.");
            Logger.getLogger(Rendezvous.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    protected void sendRandevouz(HttpServletRequest request, HttpServletResponse response, String username)
            throws ServletException, IOException, SQLException, ClassNotFoundException {
        String date = request.getParameter("date");
        String userJson = (new EditDoctorTable()).databaseToJSON(username);
        Gson gson = new Gson();
        Doctor doctor = gson.fromJson(userJson, Doctor.class);
        EditRandevouzTable ert = new EditRandevouzTable();
        ArrayList<Randevouz> rdvzs = ert.databaseToRandevouz(date, doctor.getDoctor_id());
        String json = new Gson().toJson(rdvzs);
        response.setStatus(200);
        response.getWriter().write(json);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {        

    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
